import type {PrismaClient} from "@/generated/prisma/client";

import path from "path";

import ExcelJS from "exceljs";

import {getCellString, getRequiredHeaderToCol, getRowValues, loadWorksheetFromFile} from "../shared/excel";
import {
    assertEmployeeId,
    assertIdir,
    assertBranch,
    assertProgramArea, assertJobTitle
} from "../validators/employees.validators";
import {
    assertLookupValue,
    assertUnique,
    assertNotes,
} from "../validators/common.validators";
import {assertOfficeNumber} from "../validators/offices.validators";
import {assertNoDuplicates} from "../shared/assertions";
import {parseAndAssertAssignedTo} from "../shared/parsers";
import {buildIdLookupByName, buildProgramAreaLookup, idNameSelect} from "../shared/lookups";
import {normalizeJobTitleName} from "../normalizers/employees.normalizers";
import {normalizeProgramAreaName} from "../normalizers/lookups.normalizers";
import {isNotAnEmployeeRow} from "../shared/employees";


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
    "Program Area",
    "JobTitle"
] as const

const EMPLOYEE_ID_LOOKUP_REQUIRED_HEADERS = [
    "EMPLID",
    "IDIR",
] as const

type ParsedEmployeeRow = {
    office_number: string
    idir: string | null
    first_name: string
    alternate_name: string | null
    last_name: string
    employee_id: string | null
    program_area_id: number
    job_title_id: number | null
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

    const jobTitleLookup = buildIdLookupByName(
        await prismaClient.jobTitle.findMany({
            select: idNameSelect
        })
    )

    const allowedProgramAreaJobTitlePairs = buildAllowedProgramAreaJobTitlePairs(
        await prismaClient.programAreaJobTitle.findMany({
            select: {
                program_area_id: true,
                job_title_id: true,
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
        if (isEffectivelyEmptyRow(row, computersAndLaptopsHeaderToCol)) continue

        // skip non employee rows
        if (isNotAnEmployeeRow(row, computersAndLaptopsHeaderToCol, "Assigned To")) continue

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
                    programAreaLookup,
                    jobTitleLookup,
                    allowedProgramAreaJobTitlePairs
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
            programAreaLookup,
            jobTitleLookup,
            allowedProgramAreaJobTitlePairs
        )

        finalEmployeeRows.push(employeeData)
    }

    assertNoDuplicates(
        finalEmployeeRows,
        {
            getKey: row => row.idir!,
            label: "idir",
            shouldSkip: row => !row.idir,
            caseInsensitive: true,
        })

    assertNoDuplicates(
        finalEmployeeRows,
        {
            getKey: row => row.employee_id!,
            label: "employee_id",
            shouldSkip: row => !row.employee_id
        })

    console.log(`Prepared ${finalEmployeeRows.length} employee rows for insert`)

    await prismaClient.employee.createMany({data: finalEmployeeRows})

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

        if (isNotAnEmployeeRow(row, headerToCol, "Assigned To")) continue

        const rawIdir = getCellString(row, headerToCol, "IDIR")

        if (!rawIdir || rawIdir === "IDIR") continue

        const group = rowsByIdir.get(rawIdir) ?? []
        group.push(row)
        rowsByIdir.set(rawIdir, group)
    }

    return rowsByIdir
}

/**
 * Here, we are talking about Employee Id and not the internal employee primary key
 * Map <idir, employee id>
 * @param employeeIdLookupWorksheet
 * @param employeeIdLookupHeaderToCol
 */
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

        const rawEmployeeId = getCellString(row, employeeIdLookupHeaderToCol, "EMPLID")
        const employeeId = rawEmployeeId || null

        if (!idir) continue

        assertIdir(idir, r)

        if (employeeId) {
            assertEmployeeId(employeeId, r)
        }

        assertUnique(
            seenLookupIdirs,
            idir,
            r,
            "IDIR in Employee ID Lookup"
        )

        lookup.set(idir, employeeId)
    }

    return lookup
}

function buildAllowedProgramAreaJobTitlePairs(
    rows: Array<{
        program_area_id: number
        job_title_id: number
    }>
) {
    const lookup = new Set<string>()

    for (const row of rows) {
        lookup.add(`${row.program_area_id}::${row.job_title_id}`)
    }

    return lookup
}

function isEffectivelyEmptyRow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>
) {
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")
    const rawStatus = getCellString(row, headerToCol, "Status")
    const rawBranch = getCellString(row, headerToCol, "Branch")
    const rawProgramArea = getCellString(row, headerToCol, "Program Area")
    const rawJobTitle = getCellString(row, headerToCol, "JobTitle")

    const isEmpty =
        !rawOfficeNumber &&
        !rawAssignedTo &&
        !rawStatus &&
        !rawBranch &&
        !rawProgramArea &&
        !rawJobTitle &&
        !rawIdir

    if (isEmpty) {
        console.error(`Empty row found at row ${row.number}`)
    }

    return isEmpty
}

function parseEmployeeRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>,
    employeeIdLookup: Map<string, string | null>,
    programAreaLookup: Map<string, number>,
    jobTitleLookup: Map<string, number>,
    allowedProgramAreaJobTitlePairs: Set<string>
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
    const fullName = parseAndAssertAssignedTo(assignedTo, rowNumber)

    // program area
    const {branchName, programAreaName, programAreaId} = resolveProgramAreaId(
        row,
        rowNumber,
        headerToCol,
        programAreaLookup
    )

    // job title
    const rawJobTitle = getCellString(row, headerToCol, "JobTitle")
    const isNonSddBranch = branchName === "Non SDD"

    assertJobTitle(rawJobTitle, rowNumber, !isNonSddBranch)

    const jobTitle = rawJobTitle ? normalizeJobTitleName(rawJobTitle) : ""
    const jobTitleId = jobTitle
        ? assertLookupValue(jobTitle, "Job Title", rowNumber, jobTitleLookup)
        : null

    if (jobTitleId != null) {
        const pairKey = `${programAreaId}::${jobTitleId}`

        if (!allowedProgramAreaJobTitlePairs.has(pairKey)) {
            throw new Error(`Job Title "${rawJobTitle}" is not allowed for Program Area "${programAreaName}" under Branch "${branchName}" at row ${rowNumber}`)
        }
    }

    return {
        office_number: officeNumber,
        idir,
        first_name: fullName.firstName,
        alternate_name: fullName.alternateName,
        last_name: fullName.lastName,
        employee_id: employeeId,
        program_area_id: programAreaId,
        job_title_id: jobTitleId,
        notes
    }
}

function resolveProgramAreaId(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_REQUIRED_HEADERS)[number], number>,
    programAreaLookup: Map<string, number>
) {
    const rawBranchName = getCellString(row, headerToCol, "Branch")
    assertBranch(rawBranchName, rowNumber)

    const rawProgramAreaName = getCellString(row, headerToCol, "Program Area")
    assertProgramArea(rawProgramAreaName, rowNumber)
    const programAreaName = normalizeProgramAreaName(rawProgramAreaName)

    const programAreaKey = `${rawBranchName}::${programAreaName}`

    const programAreaId = assertLookupValue(
        programAreaKey,
        'Program Area',
        rowNumber,
        programAreaLookup
    )

    return {
        branchName: rawBranchName,
        programAreaName,
        programAreaId
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
        row.program_area_id === firstRow.program_area_id &&
        row.job_title_id === firstRow.job_title_id
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
