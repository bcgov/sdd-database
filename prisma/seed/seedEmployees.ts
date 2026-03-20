import type {PrismaClient} from "@/generated/prisma/client";

import path from "path";

import ExcelJS from "exceljs";

import {getCellString, getRequiredHeaderToCol, getRowValues, loadWorksheetFromFile} from "./excel";
import {assertEmployeeId, assertName, assertIdir, assertNotes} from "./validators/employees.validators";
import {assertUnique} from "./validators/common.validators";
import {assertOfficeNumber} from "./validators/offices.validators";


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

type ParsedEmployeeRow = {
    office_number: string
    idir: string | null
    first_name: string
    alternate_name: string | null
    last_name: string
    employee_id: string | null
    program_area_id: number
    notes: string | null
}

export async function seedEmployees(prismaClient: PrismaClient) {
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

    const rowsByRealIdir = buildRowsByRealIdir(
        computersAndLaptopsWorksheet,
        computersAndLaptopsHeaderToCol
    )

    // create Employee Seed Edge Cases Output Excel Workbook
    const employeeSeedEdgeCasesWorkbook = new ExcelJS.Workbook()
    const conflictingDuplicateIdirRows = employeeSeedEdgeCasesWorkbook.addWorksheet("Conflicting Duplicate IDIR Rows")

    // copy header row from source Computers and Laptops sheet into edge-case sheet
    const headerRow = computersAndLaptopsWorksheet.getRow(1)
    const headerValues = getRowValues(headerRow, computersAndLaptopsWorksheet.columnCount)
    conflictingDuplicateIdirRows.addRow(headerValues)

    const finalEmployeeRows: ParsedEmployeeRow[] = []

    // This prevents handling the same duplicate-IDIR group multiple times.
    // If one IDIR appears in 3 rows, the main loop below sees it 3 times.
    // You only want to process that grouped set once.
    const processedRealIdirs = new Set<string>()

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        // skip rows that are effectively empty for employee seeding
        if (isEffectivelyEmptyEmployeeRow(row, computersAndLaptopsHeaderToCol)) continue

        // skip non employee rows
        if (isNotAnEmployee(row, computersAndLaptopsHeaderToCol)) continue

        const rawIdir = getCellString(row, computersAndLaptopsHeaderToCol, "IDIR")

        // if row has a real IDIR and that IDIR occurs in more than one row in the source sheet
        if (rawIdir && rawIdir !== "IDIR" && (rowsByRealIdir.get(rawIdir)?.length ?? 0) > 1) {

            if (processedRealIdirs.has(rawIdir)) {
                continue
            }

            processedRealIdirs.add(rawIdir)

            const groupedRows = rowsByRealIdir.get(rawIdir) ?? []

            const parsedRows = groupedRows.map((groupedRow) =>
                parseEmployeeRow(
                    groupedRow,
                    groupedRow.number,
                    computersAndLaptopsHeaderToCol,
                    employeeIdLookup,
                    programAreaLookup
                )
            )

            if (areEmployeeRowsConsistent(parsedRows)) {
                const mergedEmployeeData = mergeEmployeeRows(parsedRows)
                finalEmployeeRows.push(mergedEmployeeData)
            } else {
                for (const groupedRow of groupedRows) {
                    conflictingDuplicateIdirRows.addRow(
                        getRowValues(groupedRow, computersAndLaptopsWorksheet.columnCount)
                    )
                }
            }
            // This skips the normal single-row flow for that row, because duplicate group has already been handled.
            continue
        }

        const employeeData = parseEmployeeRow(
            row,
            r,
            computersAndLaptopsHeaderToCol,
            employeeIdLookup,
            programAreaLookup
        )

        finalEmployeeRows.push(employeeData)
    }

    console.log(`Prepared ${finalEmployeeRows.length} employee rows for insert`)

    // await replaceEmployees(prismaClient, finalEmployeeRows)

    // write workbook only if at least one edge-case row exists
    const hasConflictingDuplicateIdirRows = conflictingDuplicateIdirRows.rowCount > 1
    if (hasConflictingDuplicateIdirRows) {
        await employeeSeedEdgeCasesWorkbook.xlsx.writeFile(EMPLOYEE_SEED_EDGE_CASES_OUTPUT_FILE_PATH)
        console.log(`Wrote employee seed edge cases to ${EMPLOYEE_SEED_EDGE_CASES_OUTPUT_FILE_PATH}`)
    }
}

/**
 * Store all rows belonging to the same IDIR together.
 * Why?
 * Because duplicate IDIR rows may represent:
 *    •	the same employee with multiple assets
 *
 * So now you can inspect the full group and decide:
 *    •	can these rows be merged into one employee?
 *    •	or are they conflicting and need manual review?
 *
 * Blank or placeholder IDIR rows are not grouped here.
 *
 * @param worksheet
 * @param headerToCol
 */
function buildRowsByRealIdir(
    worksheet: ExcelJS.Worksheet,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>
) {
    const rowsByIdir = new Map<string, ExcelJS.Row[]>()

    for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r)

        if (!row.hasValues) continue

        if (isNotAnEmployee(row, headerToCol)) continue

        const rawIdir = getCellString(row, headerToCol, "IDIR")

        if (!rawIdir || rawIdir === "IDIR") continue

        const group = rowsByIdir.get(rawIdir) ?? []
        group.push(row)
        rowsByIdir.set(rawIdir, group)
    }

    return rowsByIdir
}

function buildEmployeeIdLookup(
    employeeIdLookupWorksheet: ExcelJS.Worksheet,
    employeeIdLookupHeaderToCol: Record<(typeof EMPLOYEE_ID_LOOKUP_REQUIRED_HEADERS)[number], number>) {
    const lookup = new Map<string, string | null>();
    const seenLookupIdirs = new Map<string, number>();

    for (let r = 2; r <= employeeIdLookupWorksheet.rowCount; r++) {
        const row = employeeIdLookupWorksheet.getRow(r)

        if (!row.hasValues) continue

        const rawIdir = getCellString(row, employeeIdLookupHeaderToCol, "IDIR")
        const idir = rawIdir.toUpperCase()
        const employeeId = getCellString(row, employeeIdLookupHeaderToCol, "EMPLID")

        if(!idir) continue
        
        assertIdir(idir, r)

        if(employeeId) {
            assertEmployeeId(employeeId, r)
        }

        assertUnique(seenLookupIdirs, idir, r, "IDIR in Employee ID Lookup")

        lookup.set(idir, employeeId)
    }

    return lookup
}

/** Pulls all existing ProgramArea rows from DB and builds a lookup map like:
 * "Community Services::Area A Staff" -> 7
 *
 * That allows your Excel text fields:
 *  •	Branch
 *  •	Program Area
 *  to be converted into the foreign key:
 *  program_area_id
 */
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

function isEffectivelyEmptyEmployeeRow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>
) {
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")
    const rawStatus = getCellString(row, headerToCol, "Status")
    const rawBranch = getCellString(row, headerToCol, "Branch")
    const rawProgramArea = getCellString(row, headerToCol, "Program Area")

    return (
        !rawOfficeNumber &&
        !rawAssignedTo &&
        !rawStatus &&
        !rawBranch &&
        !rawProgramArea &&
        !rawIdir
    )
}

function isNotAnEmployee(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>) {

    const assignedTo = getCellString(row, headerToCol, "Assigned To")

    return NON_EMPLOYEE_ASSIGNED_TO_VALUES.has(assignedTo)
}

function normalizeProgramAreaName(rawProgramArea: string) {
    const remappedProgramAreaNames: Record<string, string> = {
        "Community Integration Services - Service Delivery": "Service Delivery",
        "Community Integration Services - Practice And Performance": "Practice and Performance",
        "Executive Director Community Integration Services": "Executive Director",

        "Community Services - Area A Staff": "Area A Staff",
        "Community Services - Area B Staff": "Area B Staff",
        "Community Services - Area C Staff": "Area C Staff",

        "ADM - Service Delivery Division": "Service Delivery Division",

        "Finance, Contracts And Records Management": "Finance, Contracts and Records Management",
        "Recruitment, Staffing, Facilities, And Assets": "Recruitment, Staffing, Facilities, and Assets",
        "Executive Director - Operations Support": "Executive Director",
        "Analytics And Business Inteligence": "Analytics and Business Intelligence",
        "Communications Engagement And Organizational Health": "Communications Engagement and Organizational Health",

        "PLMS Operations": "Operations",
        "Executive Director Prevention and Loss Management Services": "Executive Director",

        "Strategic Partnerships And Communications": "Strategic Partnerships and Communications",
        "Executive Director-Strategic Services": "Executive Director",

        "Executive Director - Virtual Services": "Executive Director",

        "Ministry Of Attorney General": "Attorney General",
        "Ministry Of Children And Family Development": "Children and Family Development",
        "Citizens Services": "Citizens' Services",
        "Ministry Of Forests": "Forests",
        "Ministry Of Health": "Health",
        "Housing And Municipal Affairs": "Housing and Municipal Affairs",
        "Ministry Of Infrastructure": "Infrastructure",
        "Post Secondary Education And Skills": "Post-Secondary Education and Future Skills",
        "Ministry of Transportation and Transit": "Transportation and Transit",
        "Ministry Of Water, Land, Resource And Stewardship": "Water, Land and Resource Stewardship"
    }

    const normalizedProgramAreaName = remappedProgramAreaNames[rawProgramArea] ?? rawProgramArea

    return normalizedProgramAreaName
}

function parseEmployeeRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>,
    employeeIdLookup: Map<string, string | null>,
    programAreaLookup: Map<string, number>,
): ParsedEmployeeRow {

    // office number
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(officeNumber, rowNumber)

    // idir (optional)
    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const idir = rawIdir && rawIdir !== "IDIR" ? rawIdir : null
    if (idir) {
        assertIdir(idir, rowNumber)
    }

    // employee id (optional, only available if idir exists in lookup)
    const employeeId = idir ? (employeeIdLookup.get(idir) ?? null) : null
    if (employeeId) {
        assertEmployeeId(employeeId, rowNumber)
    }

    // notes
    const rawNotes = getCellString(row, headerToCol, "Status")
    assertNotes(rawNotes, rowNumber)
    const notes = rawNotes || null

    // first name, last name
    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const parsedAssignedTo = parseAssignedTo(assignedTo, rowNumber)

    assertName(parsedAssignedTo.firstName, "First Name", rowNumber)
    assertName(parsedAssignedTo.lastName, "Last Name", rowNumber)

    if (parsedAssignedTo.alternateName) {
        assertName(parsedAssignedTo.alternateName, "Alternate Name", rowNumber)
    }

    // program area
    const branchName = getCellString(row, headerToCol, "Branch")

    const rawProgramAreaName = getCellString(row, headerToCol, "Program Area")
    const programAreaName = normalizeProgramAreaName(rawProgramAreaName)

    const programAreaKey = `${branchName}::${programAreaName}`
    const programAreaId = programAreaLookup.get(programAreaKey)

    if (!programAreaId) {
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

    if (parts.length !== 2) {
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
    if (alternateNameMatch) {
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

function areEmployeeRowsConsistent(rows: ParsedEmployeeRow[]) {
    if (rows.length <= 1) {
        return true
    }

    const firstRow = rows[0]

    return rows.every(row =>
        row.office_number === firstRow.office_number &&
        row.idir === firstRow.idir &&
        row.first_name === firstRow.first_name &&
        row.alternate_name === firstRow.alternate_name &&
        row.last_name === firstRow.last_name &&
        row.employee_id === firstRow.employee_id &&
        row.program_area_id === firstRow.program_area_id
    )
}

function mergeEmployeeRows(rows: ParsedEmployeeRow[]): ParsedEmployeeRow {
    const firstRow = rows[0]

    const mergedNotes = Array.from(
        new Set(
            rows
                .map(row => row.notes?.trim())
                .filter((note): note is string => !!note)   // remove empty notes, and after doing that, treat every remaining note as a string.
        )
    ).join("\n")

    return {
        ...firstRow,
        notes: mergedNotes || null
    }
}

async function replaceEmployees(
    prismaClient: PrismaClient,
    employeeRows: ParsedEmployeeRow[]
) {
    await prismaClient.$transaction(async (tx) => {
        // tx is transaction scoped prisma client
        await tx.employee.deleteMany()

        for (const employeeData of employeeRows) {
            await tx.employee.create({
                data: employeeData,
            })
        }
    })
}
