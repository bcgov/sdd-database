import path from "path";
import type {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "./excel";
import ExcelJS from "exceljs";
import {assertOfficeNumber} from "./validators/offices.validators";
import {assertWorkspaceNumber} from "./validators/workspace.validators";
import {assertIdir, assertName} from "./validators/employees.validators";
import {assertNoDuplicates} from "./assertions";
import {parseAssignedTo} from "./parsers";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
);

const WORKSPACE_REQUIRED_HEADERS = [
    "OfficeNum",
    "IDIR",
    "Assigned To",
    "Workspace Number"
] as const

const NON_WORKSPACE_VALUES = new Set<string>([
    "Float",
    "Mobile",
    "Offsite",
    "Friendship Centre"
])

const NON_EMPLOYEE_ASSIGNED_TO_VALUES = new Set<string>([
    "Free Address",
    "Vacant",
    "HOLD",
    "REDEPLOY"
])

type ParsedWorkspaceRow = {
    office_number: string
    workspace_number: string
    employee_id: number | null
}

export async function seedWorkspaces(prismaClient: PrismaClient) {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(computersAndLaptopsWorksheet, WORKSPACE_REQUIRED_HEADERS)

    const employeeRows = await prismaClient.employee.findMany({
        select: {
            id: true,
            idir: true,
            office_number: true,
            first_name: true,
            alternate_name: true,
            last_name: true,
        }
    })

    const employeeIdByIdir = buildEmployeeIdByIdirLookup(employeeRows)

    const employeeIdByOfficeAndName = buildEmployeeIdByOfficeAndNameLookup(employeeRows)

    const finalWorkspaceRows: ParsedWorkspaceRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (isIncompleteWorkspaceRow(row, headerToCol)) continue

        if (ignoreForNow(row, headerToCol)) continue

        const workspaceData = parseWorkspaceRow(
            row,
            r,
            headerToCol,
            employeeIdByIdir,
            employeeIdByOfficeAndName,
        )

        finalWorkspaceRows.push(workspaceData)
    }

    assertNoDuplicates(finalWorkspaceRows, {
        getKey: row => `${row.office_number}::${row.workspace_number}`,
        label: "workspace pair",
    })

    const assignedWorkspaceRows = finalWorkspaceRows.filter(row => row.employee_id !== null)

    console.log(`Prepared ${assignedWorkspaceRows.length} workspace rows with employee assignment`)

    assertNoDuplicates(assignedWorkspaceRows, {
        getKey: row => row.employee_id!,
        label: "workspace employee_id",
    })

    console.log(`Prepared ${finalWorkspaceRows.length} workspace rows for insert`)

    await prismaClient.workspace.createMany({data: finalWorkspaceRows})
}

function isIncompleteWorkspaceRow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

    return !rawOfficeNumber || !rawWorkspaceNumber
}

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

    return NON_WORKSPACE_VALUES.has(rawWorkspaceNumber)
}

/**
 * Here by Employee Id we mean the internal primary key
 * Map <idir, id>
 * @param rows
 */
function buildEmployeeIdByIdirLookup(
    rows: Array<{
        id: number
        idir: string | null
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        if (!row.idir || row.idir === "IDIR") continue
        lookup.set(row.idir, row.id)
    }

    return lookup
}

/**
 * Here by Employee Id we mean the internal primary key
 * Map <officeNumber::last_name::first_name::alternate_name, id>
 * @param rows
 */
function buildEmployeeIdByOfficeAndNameLookup(
    rows: Array<{
        id: number
        office_number: string
        first_name: string
        alternate_name: string | null
        last_name: string
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        const key = `${row.office_number}::${row.last_name}::${row.first_name}${row.alternate_name ? `::${row.alternate_name}` : ""}`
        lookup.set(key, row.id)
    }

    return lookup
}

function parseWorkspaceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>,
    employeeIdByIdir: Map<string, number>,
    employeeIdByOfficeAndNameLookup: Map<string, number>,
): ParsedWorkspaceRow {
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(rawOfficeNumber, rowNumber)

    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    assertWorkspaceNumber(rawWorkspaceNumber, rowNumber)

    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const idir = rawIdir && rawIdir !== "IDIR" ? rawIdir : null
    if (idir) {
        assertIdir(idir, rowNumber)
    }

    // internal employee id i.e. primary key
    let employeeId = idir ? (employeeIdByIdir.get(idir) ?? null) : null

    // if idir is not available to fetch employee internal id then we rely on Assigned To and Office Number field
    if (!employeeId) {

        const assignedTo = getCellString(row, headerToCol, "Assigned To")

        if (!NON_EMPLOYEE_ASSIGNED_TO_VALUES.has(assignedTo)) {
            const parsedAssignedTo = parseAssignedTo(assignedTo, rowNumber)

            assertName(parsedAssignedTo.firstName, "First Name", rowNumber)
            assertName(parsedAssignedTo.lastName, "Last Name", rowNumber)

            if (parsedAssignedTo.alternateName) {
                assertName(parsedAssignedTo.alternateName, "Alternate Name", rowNumber)
            }

            const key = `${rawOfficeNumber}::${parsedAssignedTo.lastName}::${parsedAssignedTo.firstName}${parsedAssignedTo.alternateName ? `::${parsedAssignedTo.alternateName}` : ""}`

            employeeId = employeeIdByOfficeAndNameLookup.get(key) ?? null

            // if even office number and Assigned To field is not enough, then we console.error
            if (!employeeId) {
                console.error("Could not match workspace row to employee:")
                console.error({
                    rowNumber,
                    office_number: rawOfficeNumber,
                    assignedTo,
                    idir,
                    workspace_number: rawWorkspaceNumber,
                })
            }
        }
    }

    return {
        office_number: rawOfficeNumber,
        workspace_number: rawWorkspaceNumber,
        employee_id: employeeId
    }
}
