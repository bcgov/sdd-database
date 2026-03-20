import path from "path";
import type {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "./excel";
import ExcelJS from "exceljs";
import {assertOfficeNumber} from "./validators/offices.validators";
import {assertWorkspaceNumber} from "./validators/workspace.validators";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
);

const WORKSPACE_REQUIRED_HEADERS = [
    "OfficeNum",
    "Workspace Number"
] as const

const NON_WORKSPACE_VALUES = new Set<string>([
    "Float",
    "Mobile",
    "Offsite",
    "Friendship Centre"
])

type ParsedWorkspaceRow = {
    office_number: string
    workspace_number: string
}

export async function seedWorkspaces(prismaClient: PrismaClient) {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(computersAndLaptopsWorksheet, WORKSPACE_REQUIRED_HEADERS)

    const finalWorkspaceRows: ParsedWorkspaceRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (isEffectivelyEmptyWorkspaceRow(row, headerToCol)) continue

        if (ignoreForNow(row, headerToCol)) continue

        const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
        const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

        if (!rawOfficeNumber || !rawWorkspaceNumber) continue

        const workspaceData = parseWorkspaceRow(row, r, headerToCol)

        finalWorkspaceRows.push(workspaceData)
    }

    assertNoDuplicateWorkspacePairs(finalWorkspaceRows)

    console.log(`Prepared ${finalWorkspaceRows.length} workspace rows for insert`)

    await replaceWorkspaces(prismaClient, finalWorkspaceRows)
}

function isEffectivelyEmptyWorkspaceRow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

    return !rawOfficeNumber && !rawWorkspaceNumber
}

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

    return NON_WORKSPACE_VALUES.has(rawWorkspaceNumber)
}

function parseWorkspaceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSPACE_REQUIRED_HEADERS)[number], number>
): ParsedWorkspaceRow {
    const rawOfficeNumber = getCellString(row, headerToCol, "OfficeNum")

    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

    assertOfficeNumber(rawOfficeNumber, rowNumber)
    assertWorkspaceNumber(rawWorkspaceNumber, rowNumber)

    return {
        office_number: rawOfficeNumber,
        workspace_number: rawWorkspaceNumber
    }
}

function assertNoDuplicateWorkspacePairs(workspaceRows: ParsedWorkspaceRow[]) {
    const seen = new Map<string, ParsedWorkspaceRow>()
    const duplicates: ParsedWorkspaceRow[] = []

    for (const row of workspaceRows) {

        const key = `${row.office_number}::${row.workspace_number}`

        if(seen.has(key)) {
            duplicates.push(row)
            console.error("Duplicate workspace pair found:", {
                first: seen.get(key),
                duplicate: row
            })
        }
        else {
            seen.set(key, row)
        }
    }

    if(duplicates.length > 0) {
        throw new Error(`Found ${duplicates.length} duplicate workspace rows. Check logs above.`)
    }
}

async function replaceWorkspaces(
    prismaClient: PrismaClient,
    workspaceRows: ParsedWorkspaceRow[]
) {

    await prismaClient.workspace.deleteMany()
    await prismaClient.workspace.createMany({data: workspaceRows})
}
