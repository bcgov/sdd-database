import type {PrismaClient} from "@/generated/prisma/client";

import path from "path";

import ExcelJS from "exceljs";

import {getCellString, getRequiredHeaderToCol, getRowValues, loadWorksheetFromFile, logSheetInfo} from "./excel";
import {assertEmployeeId, assertName, assertIdir, assertNotes} from "./validators/employees.validators";
import {assertUnique} from "./validators/common.validators";
import {assertOfficeNumber} from "./validators/offices.validators";
import {branchNames} from "./constants";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
);
const EMPLOYEE_ID_LOOKUP_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Employee ID Lookup.xlsx"
)

const EMPLOYEE_SEED_EDGE_CASES_OUTPUT_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Employee Seed Edge Cases.xlsx"
)

const COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS = [
    "OfficeNum",
    "IDIR",
    "Assigned To",
    "Status",
    "Branch",
    "Program Area"
] as const

const EMPLOYEE_ID_LOOKUP_REQUIRED_HEADERS = [
    "EMPLID",
    "IDIR",
] as const

const NON_EMPLOYEE_ASSIGNED_TO_VALUES = new Set<string>([
    "Free Address",
    "Vacant",
    "HOLD",
    "PUBLIC JobBank Kiosk",
    "REDEPLOY"
] as const)

const validBranchNames = new Set<string>(branchNames)

export async function seedEmployees(prismaClient: PrismaClient)  {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)
    const employeeIdLookupWorksheet = await loadWorksheetFromFile(EMPLOYEE_ID_LOOKUP_FILE_PATH)

    const computersAndLaptopsHeaderToCol = getRequiredHeaderToCol(computersAndLaptopsWorksheet, COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)

    const employeeIdLookupHeaderToCol = getRequiredHeaderToCol(employeeIdLookupWorksheet, EMPLOYEE_ID_LOOKUP_REQUIRED_HEADERS)

    const employeeIdLookup = buildEmployeeIdLookup(employeeIdLookupWorksheet, employeeIdLookupHeaderToCol)

    const programAreaLookup = buildProgramAreaLookup(
        await prismaClient.programArea.findMany({
            select: {
                id: true,
                name: true,
                branch: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    )

    const employeeIdirCounts = buildEmployeeIdirCounts(
        computersAndLaptopsWorksheet,
        computersAndLaptopsHeaderToCol
    )

    // create Employee Seed Edge Cases Output Excel Workbook
    const employeeSeedEdgeCasesWorkbook = new ExcelJS.Workbook()
    const placeholderIdirWorksheet = employeeSeedEdgeCasesWorkbook.addWorksheet("Placeholder IDIR")
    const blankIdirWorksheet = employeeSeedEdgeCasesWorkbook.addWorksheet("Blank IDIR")
    const multipleRowsPerIdirWorksheet = employeeSeedEdgeCasesWorkbook.addWorksheet("Multiple Rows Per IDIR")
    const employeeIdNotFoundWorksheet = employeeSeedEdgeCasesWorkbook.addWorksheet("Employee ID Not Found")

    // copy header row from source Computers and Laptops sheet into all edge-case sheets
    const headerRow = computersAndLaptopsWorksheet.getRow(1)
    const headerValues = getRowValues(headerRow, computersAndLaptopsWorksheet.columnCount)
    placeholderIdirWorksheet.addRow(headerValues)
    blankIdirWorksheet.addRow(headerValues)
    multipleRowsPerIdirWorksheet.addRow(headerValues)
    employeeIdNotFoundWorksheet.addRow(headerValues)

    for (let r= 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        // skip fully empty rows
        if (!row.hasValues) continue

        // skip non employee rows
        if (isNotAnEmployee(row, computersAndLaptopsHeaderToCol)) continue

        // employee exists but IDIR is still a placeholder
        const idir = getCellString(row, computersAndLaptopsHeaderToCol, "IDIR")
        if (idir === "IDIR") {
            placeholderIdirWorksheet.addRow(
                getRowValues(row, computersAndLaptopsWorksheet.columnCount)
            );
            continue
        }

        // employee exists but IDIR is blank / missing
        if (!idir) {
            blankIdirWorksheet.addRow(
                getRowValues(row, computersAndLaptopsWorksheet.columnCount)
            );
            continue
        }

        // multiple rows with the same idir
        if ((employeeIdirCounts.get(idir) ?? 0) > 1) {
            multipleRowsPerIdirWorksheet.addRow(
                getRowValues(row, computersAndLaptopsWorksheet.columnCount)
            )
            continue
        }

        // real IDIR exists, but no matching employee ID found in lookup file
        const employeeId = employeeIdLookup.get(idir)
        if (!employeeId) {
            employeeIdNotFoundWorksheet.addRow(
                getRowValues(row, computersAndLaptopsWorksheet.columnCount)
            );
            continue;
        }

        const employeeData = parseEmployeeRow(
            row,
            r,
            computersAndLaptopsHeaderToCol,
            employeeId,
            programAreaLookup
        )

        // console.log(employeeData)

        await prismaClient.employee.upsert({
            where: {
                employee_id: employeeData.employee_id
            },
            update: {
                office_number: employeeData.office_number,
                idir: employeeData.idir,
                first_name: employeeData.first_name,
                alternate_name: employeeData.alternate_name,
                last_name: employeeData.last_name,
                program_area_id: employeeData.program_area_id,
                notes: employeeData.notes
            },
            create: employeeData
        })
    }

    // write workbook only if at least one edge-case row exists
    const hasPlaceholderIdirRows = placeholderIdirWorksheet.rowCount > 1
    const hasBlankIdirRows = blankIdirWorksheet.rowCount > 1
    const hasMultipleRowsPerIdirRows = multipleRowsPerIdirWorksheet.rowCount > 1
    const hasEmployeeIdNotFoundRows = employeeIdNotFoundWorksheet.rowCount > 1
    if (
        hasPlaceholderIdirRows ||
        hasBlankIdirRows ||
        hasMultipleRowsPerIdirRows ||
        hasEmployeeIdNotFoundRows
    ) {
        await employeeSeedEdgeCasesWorkbook.xlsx.writeFile(EMPLOYEE_SEED_EDGE_CASES_OUTPUT_FILE_PATH)
        console.log(`Wrote employee seed edge cases to ${EMPLOYEE_SEED_EDGE_CASES_OUTPUT_FILE_PATH}`)
    }
}

function isNotAnEmployee(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>) {

    const assignedTo = getCellString(row, headerToCol, "Assigned To")

    return NON_EMPLOYEE_ASSIGNED_TO_VALUES.has(assignedTo)
}

function buildEmployeeIdirCounts(
    worksheet: ExcelJS.Worksheet,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>
) {
    const idirCounts = new Map<string, number>()

    for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r)

        if(!row.hasValues) continue
        if(isNotAnEmployee(row, headerToCol)) continue

        const idir = getCellString(row, headerToCol, "IDIR")

        // ignore placeholder and blank IDIR rows for this duplicate check
        if (!idir || idir === "IDIR") continue

        idirCounts.set(idir, (idirCounts.get(idir) ?? 0) + 1)
    }

    return idirCounts
}

function buildEmployeeIdLookup(
    employeeIdLookupWorksheet: ExcelJS.Worksheet,
    employeeIdLookupHeaderToCol: Record<(typeof EMPLOYEE_ID_LOOKUP_REQUIRED_HEADERS)[number], number>)
{
    const lookup = new Map<string, string>();
    const seenLookupIdirs = new Map<string, number>();

    for (let r = 2; r <= employeeIdLookupWorksheet.rowCount; r++) {
        const row = employeeIdLookupWorksheet.getRow(r)

        if (!row.hasValues) continue

        const idir = getCellString(row, employeeIdLookupHeaderToCol, "IDIR").toUpperCase()
        const employeeId = getCellString(row, employeeIdLookupHeaderToCol, "EMPLID")

        assertIdir(idir, r)
        assertEmployeeId(employeeId, r)
        assertUnique(seenLookupIdirs, idir, r, "IDIR in Employee ID Lookup")

        lookup.set(idir, employeeId)
    }

    return lookup
}

function buildProgramAreaLookup(
    rows: Array<{
        id: number
        name: string
        branch: { name: string }
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        const key = `${row.branch.name}::${row.name}`
        lookup.set(key, row.id)
    }

    return lookup
}

function normalizeBranchName(rawBranchName: string, rowNumber: number) {
    const remappedBranchNames: Record<string, string> = {
        "Community Integration Services Branch": "Community Integration Services",
        "Strategic Services Branch": "Strategic Services",
    }

    const normalizedBranchName = remappedBranchNames[rawBranchName] ?? rawBranchName

    if(!validBranchNames.has(normalizedBranchName)) {
        throw new Error(`No normalized Branch mapping found for "${rawBranchName}" at row ${rowNumber}`)
    }

    return normalizedBranchName
}

function normalizeProgramAreaName(rawProgramArea: string, rowNumber: number) {
    const remappedProgramAreaNames: Record<string, string> = {
        "COMMUNITY INTEGRATION SERVICES - SERVICE DELIVERY": "Service Delivery",
        "Community Integration Services - Service Delivery": "Service Delivery",
        "COMMUNITY INTEGRATION SERVICES - PRACTICE AND PERFORMANCE": "Practice And Performance",
        "EXECUTIVE DIRECTOR COMMUNITY INTEGRATION SERVICES": "Executive Director",

        "COMMUNITY SERVICES - AREA A STAFF": "Area A Staff",
        "Community Services - Area A Staff": "Area A Staff",
        "COMMUNITY SERVICES - AREA B STAFF": "Area B Staff",
        "Community Services - Area B Staff": "Area B Staff",
        "COMMUNITY SERVICES - AREA C STAFF": "Area C Staff",
        "Community Services - Area C Staff": "Area C Staff",

        "ADM - Service Delivery Division": "Service Delivery Division",

        "FINANCE, CONTRACTS AND RECORDS MANAGEMENT": "Finance, Contracts And Records Management",
        "RECRUITMENT, STAFFING, FACILITIES, AND ASSETS": "Recruitment, Staffing, Facilities, And Assets",
        "EXECUTIVE DIRECTOR  - OPERATIONS SUPPORT": "Executive Director",
        "Analytics And Business Inteligence": "Analytics And Business Intelligence",

        "PLMS OPERATIONS": "Operations",
        "PLMS Operations": "Operations",
        "PROGRAM INTEGRITY & EVALUATION": "Program Integrity & Evaluation",
        "EXECUTIVE DIRECTOR PREVENTION AND LOSS MANAGEMENT SERVICES": "Executive Director",

        "Executive Director-Strategic Services": "Executive Director",

        "INTAKE": "Intake",
        "CONTACT CENTRE": "Contact Centre",
        "HEALTH & SPECIALIZED SERVICES": "Health & Specialized Services",
        "EXECUTIVE DIRECTOR-VIRTUAL SERVICES": "Executive Director",
    }

    const normalizedProgramAreaName = remappedProgramAreaNames[rawProgramArea] ?? rawProgramArea

    return normalizedProgramAreaName
}

function parseEmployeeRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>,
    employeeId: string,
    programAreaLookup: Map<string, number>,
) {

    // office number
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(officeNumber, rowNumber)

    // idir
    const idir = getCellString(row, headerToCol, "IDIR")
    assertIdir(idir, rowNumber)

    // notes
    const rawNotes = getCellString(row, headerToCol, "Status")
    assertNotes(rawNotes, rowNumber)
    const notes = rawNotes || null

    // first name, last name
    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const parsedAssignedTo = parseAssignedTo(assignedTo, rowNumber)

    assertName(parsedAssignedTo.firstName, "First Name", rowNumber)
    assertName(parsedAssignedTo.lastName, "Last Name", rowNumber)

    if(parsedAssignedTo.alternateName){
        assertName(parsedAssignedTo.alternateName, "Alternate Name", rowNumber)
    }

    // program area
    const rawBranchName = getCellString(row, headerToCol, "Branch")
    const branchName = normalizeBranchName(rawBranchName, rowNumber)

    const rawProgramAreaName = getCellString(row, headerToCol, "Program Area")
    const programAreaName = normalizeProgramAreaName(rawProgramAreaName, rowNumber)

    const programAreaKey = `${branchName}::${programAreaName}`
    const programAreaId = programAreaLookup.get(programAreaKey)

    if(!programAreaId){
        throw new Error(
            `No Program Area found for Branch "${branchName}" and Program Area "${programAreaName}" at row ${rowNumber}`
        )
    }

    return {
        office_number: officeNumber,
        idir,
        first_name: parsedAssignedTo.firstName,
        alternate_name: parsedAssignedTo.alternateName,
        last_name: parsedAssignedTo.lastName,
        employee_id: employeeId,
        program_area_id: programAreaId,
        notes
    }
}

function parseAssignedTo(assignedTo: string, rowNumber: number) {
    const parts = assignedTo.split(",").map(part => part.trim())

    if(parts.length !== 2) {
        throw new Error(
            `Assigned To could not be parsed into employee name fields at row ${rowNumber}. Expected a name like "Last, First". Got "${assignedTo}"`
        )
    }

    const [lastName, firstNameAndPossibleAlternateName] = parts

    if (!lastName) {
        throw new Error(
            `Assigned To is missing last name at row ${rowNumber}. Got "${assignedTo}"`
        )
    }

    if (!firstNameAndPossibleAlternateName) {
        throw new Error(
            `Assigned To is missing first name at row ${rowNumber}. Got "${assignedTo}"`
        )
    }

    const alternateNameMatch = firstNameAndPossibleAlternateName.match(/^(.+?) \((.+)\)$/)
    if(alternateNameMatch) {
        const [, firstName, alternateName] = alternateNameMatch

        return {
            firstName,
            alternateName,
            lastName,
        }
    }

    return {
        firstName: firstNameAndPossibleAlternateName,
        alternateName: null,
        lastName,
    }
}
