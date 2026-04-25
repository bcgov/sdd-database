import path from "path";
import type {PrismaClient} from "@/generated/prisma/client";
import ExcelJS from "exceljs";
import {buildIdLookupByName, buildProgramAreaLookup, idNameSelect} from "../shared/lookups";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {assertNoDuplicates} from "../shared/assertions";
import {assertOfficeNumber} from "../validators/offices.validators";
import {
    assertWorkspaceNumber,
    assertWorkspaceNumberMatchesOfficeFloor,
    parseAndAssertOfficeFloor
} from "../validators/workspaces.validators";
import {normalizeCategoryName, normalizeDeskTypeName} from "../normalizers/workspaces.normalizers";
import {assertLookupValue, assertNotes} from "../validators/common.validators";
import {
    buildEmployeeResolutionContext,
    EmployeeResolutionContext,
    isNonResidentWorkspaceAssignmentType,
    resolveEmployeeId
} from "../shared/employees";
import {normalizeProgramAreaName} from "../normalizers/lookups.normalizers";
import {assertBranch, assertProgramArea} from "../validators/employees.validators";


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
    "Hardware",
    "Workspace Number",
    "Workspace Type",
    "OfficeFloor",
    "Branch",
    "Program Area",
    "Workspace Category",
    "DeskType"
] as const

const WORKSPACE_ONLY_ASSIGNED_TO_VALUES = new Set<string>([
    "Free Address",
    "HOLD",
    "Vacant",
])

const ALLOWED_WORKSPACE_TYPES = new Set<string>([
    "Protected Community Services",
    "Protected Criminal Investigations Unit",
    "Protected File Hub",
    "Resident",
    "Free Address",
] as const)

const PROTECTED_WORKSPACE_TYPES = new Set<string>([
    "Protected Community Services",
    "Protected Criminal Investigations Unit",
    "Protected File Hub",
] as const)

type ParsedWorkspaceRow = {
    office_number: string
    workspace_number: string
    category_id: number
    desk_type_id: number
    office_floor: number
    notes: string | null
    employee_id: number | null
    is_on_hold: boolean
    restricted_program_area_id: number | null
}

export async function seedWorkspaces(prismaClient: PrismaClient) {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(computersAndLaptopsWorksheet, WORKSPACE_REQUIRED_HEADERS)

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

    const programAreaLookup = buildProgramAreaLookup(
        await prismaClient.programArea.findMany({
                select: {
                    id: true,
                    name: true,
                    branch: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        )
    )

    const employeeResolutionContext = await buildEmployeeResolutionContext(prismaClient)

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
            programAreaLookup,
            employeeResolutionContext
        )

        finalWorkspaceRows.push(workspaceData)
    }

    assertNoDuplicates(finalWorkspaceRows, {
        getKey: row => `${row.office_number}::${row.workspace_number}`,
        label: "workspace pair",
    })

    assertNoDuplicates(finalWorkspaceRows, {
        getKey: row => row.employee_id!,
        label: "workspace employee_id",
        shouldSkip: row => row.employee_id == null,
    })

    const assignedWorkspaceRows = finalWorkspaceRows.filter(row => row.employee_id !== null)

    console.log(`Prepared ${assignedWorkspaceRows.length} workspace rows with employee assignment`)
    console.log(`Prepared ${finalWorkspaceRows.length} workspace rows for insert`)

    await prismaClient.workspace.createMany({data: finalWorkspaceRows})
}

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")
    const rawHardware = getCellString(row, headerToCol, "Hardware")

    const isPublicJobBankKiosk =
        rawAssignedTo === "PUBLIC JobBank Kiosk" ||
        rawCategory === "Waiting Room" ||
        rawHardware === "Kiosk - Thinkcentre M80Q"

    return isPublicJobBankKiosk
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

    if (isNonResidentWorkspaceAssignmentType(rawWorkspaceNumber)) return true

    if (rawAssignedTo === "HOLD") return false

    const isEffectivelyEmptyWorkspaceRow =
        !rawWorkspaceNumber &&
        !rawWorkspaceType &&
        !rawOfficeFloor &&
        !rawCategory &&
        !rawDeskType

    return isEffectivelyEmptyWorkspaceRow
}

function parseWorkspaceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>,
    categoryLookup: Map<string, number>,
    deskTypeLookup: Map<string, number>,
    programAreaLookup: Map<string, number>,
    employeeResolutionContext: EmployeeResolutionContext
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
            employeeResolutionContext
        }
    )

    // notes
    const shouldSeedNotes = WORKSPACE_ONLY_ASSIGNED_TO_VALUES.has(assignedTo)

    const rawNotes = getCellString(row, headerToCol, "Status")
    assertNotes(rawNotes, rowNumber)

    const notes = shouldSeedNotes
        ? (rawNotes || null)   // making sure to store null instead of ""
        : null

    // restricted program area
    const rawWorkspaceType = getCellString(row, headerToCol, "Workspace Type")
    assertAllowedWorkspaceType(rawWorkspaceType, rowNumber)

    const restrictedProgramAreaId = PROTECTED_WORKSPACE_TYPES.has(rawWorkspaceType)
        ? resolveRestrictedProgramAreaId(
            row,
            rowNumber,
            headerToCol,
            programAreaLookup,
        )
        : null

    return {
        office_number: rawOfficeNumber,
        workspace_number: rawWorkspaceNumber,
        category_id: categoryId,
        desk_type_id: deskTypeId,
        office_floor: officeFloor,
        restricted_program_area_id: restrictedProgramAreaId,
        employee_id: employeeId,
        is_on_hold: isOnHold,
        notes
    }
}

function assertAllowedWorkspaceType(workspaceType: string, rowNumber: number) {
    if (!ALLOWED_WORKSPACE_TYPES.has(workspaceType)) {
        throw new Error(
            `Workspace type "${workspaceType}" at row ${rowNumber} is not a valid option.`
        )
    }
}

function resolveRestrictedProgramAreaId(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>,
    programAreaLookup: Map<string, number>
) {
    const rawBranchName = getCellString(row, headerToCol, "Branch")
    assertBranch(rawBranchName, rowNumber)

    const rawProgramAreaName = getCellString(row, headerToCol, "Program Area")
    assertProgramArea(rawProgramAreaName, rowNumber)
    const programAreaName = normalizeProgramAreaName(rawProgramAreaName)

    const programAreaKey = `${rawBranchName}::${programAreaName}`

    return assertLookupValue(
        programAreaKey,
        'Restricted Program Area',
        rowNumber,
        programAreaLookup
    )
}
