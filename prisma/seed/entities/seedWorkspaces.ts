import path from "path";
import type {PrismaClient} from "@/generated/prisma/client";
import ExcelJS from "exceljs";
import {buildIdLookupByName, idNameSelect} from "../shared/lookups";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {assertNoDuplicates} from "../shared/assertions";
import {assertOfficeNumber} from "../validators/offices.validators";
import {
    assertWorkspaceNumber,
    assertWorkspaceNumberMatchesOfficeFloor,
    parseAndAssertOfficeFloor
} from "../validators/workspace.validators";
import {normalizeCategoryName, normalizeDeskTypeName} from "../normalizers/workspaces.normalizers";
import {assertLookupValue, assertNotes} from "../validators/common.validators";
import {
    buildEmployeeIdByIdirLookup,
    buildEmployeeIdByOfficeAndNameLookup,
    resolveEmployeeId
} from "../shared/employees";


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
    "DeskType"
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

type ParsedWorkspaceRow = {
    office_number: string
    workspace_number: string
    category_id: number
    desk_type_id: number
    office_floor: number
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

    const deskTypeLookup = buildIdLookupByName(
        await prismaClient.deskType.findMany({
            select: idNameSelect
        })
    )

    const employeeIdByIdir = buildEmployeeIdByIdirLookup(employeeRows)
    const employeeIdByOfficeAndName = buildEmployeeIdByOfficeAndNameLookup(employeeRows)

    const finalWorkspaceRows: ParsedWorkspaceRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (ignoreForNow(row, headerToCol)) continue

        if (isNotAWorkspaceRow(row, headerToCol)) continue

        const workspaceData = parseWorkspaceRow(
            row,
            r,
            headerToCol,
            categoryLookup,
            deskTypeLookup,
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

function isNotAWorkspaceRow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")
    const rawWorkspaceType = getCellString(row, headerToCol, "Workspace Type")
    const rawOfficeFloor = getCellString(row, headerToCol, "OfficeFloor")
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const rawDeskType = getCellString(row, headerToCol, "DeskType")

    return (
        !rawWorkspaceNumber &&
        !rawWorkspaceType &&
        !rawOfficeFloor &&
        !rawCategory &&
        !rawDeskType &&
        rawAssignedTo !== "HOLD"
    )
}

function parseWorkspaceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>,
    categoryLookup: Map<string, number>,
    deskTypeLookup: Map<string, number>,
    employeeIdByIdirLookup: Map<string, number>,
    employeeIdByOfficeAndNameLookup: Map<string, number>,
): ParsedWorkspaceRow {
    // office number
    const officeNumberHeader = "OfficeNum"
    const rawOfficeNumber = getCellString(row, headerToCol, officeNumberHeader)
    assertOfficeNumber(rawOfficeNumber, rowNumber)

    // workspace number
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    assertWorkspaceNumber(rawWorkspaceNumber, rowNumber)

    // category
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const category = normalizeCategoryName(rawCategory)
    const categoryId = assertLookupValue(category, "Category", rowNumber, categoryLookup)

    // desk type
    const rawDeskType = getCellString(row, headerToCol, "DeskType")
    const deskType = normalizeDeskTypeName(rawDeskType)
    const deskTypeId = assertLookupValue(deskType, "Desk Type", rowNumber, deskTypeLookup)

    // office floor
    const rawOfficeFloor = getCellString(row, headerToCol, "OfficeFloor")
    const officeFloor = parseAndAssertOfficeFloor(rawOfficeFloor, rowNumber)
    assertWorkspaceNumberMatchesOfficeFloor(
        rawWorkspaceNumber,
        officeFloor,
        rawOfficeNumber,
        rowNumber,
    )

    // is_on_hold
    const assignedToHeader = "Assigned To"
    const assignedTo = getCellString(row, headerToCol, assignedToHeader)
    const isOnHold = assignedTo === "HOLD"

    // internal employee id i.e. primary key
    const employeeId = resolveEmployeeId(
        row,
        rowNumber,
        headerToCol,
        {
            assignedToHeader,
            idirHeader: "IDIR",
            officeNumberHeader,
            employeeIdByIdirLookup,
            employeeIdByOfficeAndNameLookup
        }
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
        desk_type_id: deskTypeId,
        office_floor: officeFloor,
        employee_id: employeeId,
        is_on_hold: isOnHold,
        notes
    }
}
