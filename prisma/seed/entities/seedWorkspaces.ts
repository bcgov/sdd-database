import path from "path";
import type {PrismaClient} from "@/generated/prisma/client";
import ExcelJS from "exceljs";
import {buildIdLookupByName, idNameSelect} from "../shared/lookups";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {assertNoDuplicates} from "../shared/assertions";
import {assertOfficeNumber} from "../validators/offices.validators";
import {assertIdir, assertName} from "../validators/employees.validators";
import {assertWorkspaceNumber} from "../validators/workspace.validators";
import {parseAssignedTo} from "../shared/parsers";
import {normalizeCategoryName} from "../normalizers/workspaces.normalizers";
import {assertLookupValue, assertNotes} from "../validators/common.validators";


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
    "Status",
    "Workspace Number",
    "Workspace Type",
    "OfficeFloor",
    "Workspace Category",
] as const

const WORKSPACE_ONLY_ASSIGNED_TO_VALUES = new Set<string>([
    "HOLD",
    "Vacant",
    "Free Address"
])

const NON_WORKSPACE_VALUES = new Set<string>([
    "Float",
    "Mobile",
    "Offsite",
    "Friendship Centre"
])

const NON_EMPLOYEE_ASSIGNED_TO_VALUES = new Set<string>([
    "Free Address",
    "Vacant",
    "REDEPLOY"
])

type ParsedWorkspaceRow = {
    office_number: string
    workspace_number: string
    category_id: number
    employee_id: number | null
    is_on_hold: boolean
    notes: string | null
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

    const categoryLookup = buildIdLookupByName(
        await prismaClient.workspaceCategory.findMany({
            select: idNameSelect
        })
    )

    const employeeIdByIdir = buildEmployeeIdByIdirLookup(employeeRows)

    const employeeIdByOfficeAndName = buildEmployeeIdByOfficeAndNameLookup(employeeRows)

    const finalWorkspaceRows: ParsedWorkspaceRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (ignoreForNow(row, headerToCol)) continue

        if (!isAWorkspace(row, headerToCol)) continue

        const workspaceData = parseWorkspaceRow(
            row,
            r,
            headerToCol,
            categoryLookup,
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

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const rawWorkspaceType = getCellString(row, headerToCol, "Workspace Type")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")

    const isPublicJobBankKiosk =
        rawAssignedTo === "PUBLIC JobBank Kiosk" ||
        rawWorkspaceType === "Kiosk" ||
        rawCategory === "Waiting Room"

    return NON_WORKSPACE_VALUES.has(rawWorkspaceNumber) || isPublicJobBankKiosk
}

function isAWorkspace(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")
    const rawWorkspaceType = getCellString(row, headerToCol, "Workspace Type")
    const rawOfficeFloor = getCellString(row, headerToCol, "OfficeFloor")
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")

    return (
        !!rawWorkspaceNumber ||
        rawAssignedTo === "HOLD" ||
        !!rawWorkspaceType ||
        !!rawOfficeFloor ||
        !!rawCategory
    )
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
    categoryLookup: Map<string, number>,
    employeeIdByIdir: Map<string, number>,
    employeeIdByOfficeAndNameLookup: Map<string, number>,
): ParsedWorkspaceRow {
    // office number
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(rawOfficeNumber, rowNumber)

    // workspace number
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    assertWorkspaceNumber(rawWorkspaceNumber, rowNumber)

    // category
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const category = normalizeCategoryName(rawCategory)
    const categoryId = assertLookupValue(category, "Category", rowNumber, categoryLookup)

    // is_on_hold
    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const isOnHold = assignedTo === "HOLD"

    // internal employee id i.e. primary key
    const employeeId = resolveAssignedEmployeeId(
        row,
        rowNumber,
        headerToCol,
        rawWorkspaceNumber,
        rawOfficeNumber,
        assignedTo,
        isOnHold,
        employeeIdByIdir,
        employeeIdByOfficeAndNameLookup,
    )

    // notes
    const shouldSeedNotes = WORKSPACE_ONLY_ASSIGNED_TO_VALUES.has(assignedTo)

    const rawNotes = getCellString(row, headerToCol, "Status")
    assertNotes(rawNotes, rowNumber)

    const notes = shouldSeedNotes
        ? (rawNotes || null)   // making sure to store null instead of ""
        : null

    return {
        office_number: rawOfficeNumber,
        workspace_number: rawWorkspaceNumber,
        category_id: categoryId,
        employee_id: employeeId,
        is_on_hold: isOnHold,
        notes
    }
}

function resolveAssignedEmployeeId(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>,
    rawWorkspaceNumber: string,
    rawOfficeNumber: string,
    assignedTo: string,
    isOnHold: boolean,
    employeeIdByIdir: Map<string, number>,
    employeeIdByOfficeAndNameLookup: Map<string, number>,
) {

    if (isOnHold) {
        return null
    }

    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const idir = rawIdir && rawIdir !== "IDIR" ? rawIdir : null
    if (idir) {
        assertIdir(idir, rowNumber)
    }

    // internal employee id i.e. primary key
    let employeeId = idir ? (employeeIdByIdir.get(idir) ?? null) : null

    // if idir is not available to fetch employee internal id then we rely on Assigned To and Office Number field
    if (!employeeId) {
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
    return employeeId
}
