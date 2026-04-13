import path from "path";
import {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertAssetTag} from "../validators/workstations.validators";
import {assertNoDuplicates} from "../shared/assertions";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
)

const WORKSTATION_REQUIRED_HEADERS = [
    "Computer Number",
    "Assigned To",
    "Workspace Type",
    "Workspace Category"
] as const

type ParsedWorkstationRow = {
    asset_tag: string
}

export async function seedWorkstations(prismaClient: PrismaClient) {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        computersAndLaptopsWorksheet,
        WORKSTATION_REQUIRED_HEADERS
    )

    const finalWorkstationRows: ParsedWorkstationRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++)
    {
        const row = computersAndLaptopsWorksheet.getRow(r)

        const rawAssetTag = getCellString(row, headerToCol, "Computer Number")

        if (!rawAssetTag) continue

        if (ignoreForNow(row, headerToCol)) continue

        const workstationData = parseWorkstationRow(
            row,
            r,
            headerToCol,
        )

        finalWorkstationRows.push(workstationData)
    }

    assertNoDuplicates(finalWorkstationRows, {
        getKey: row => row.asset_tag,
        label: "workstation asset_tag",
        caseInsensitive: true,
    })

    console.log(`Prepared ${finalWorkstationRows.length} workstation rows for insert`)

    await prismaClient.workstation.createMany({
        data: finalWorkstationRows
    })
}

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSTATION_REQUIRED_HEADERS)[number], number>
) {
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const rawWorkspaceType = getCellString(row, headerToCol, "Workspace Type")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")

    const isPublicJobBankKiosk =
        rawAssignedTo === "PUBLIC JobBank Kiosk" ||
        rawWorkspaceType === "Kiosk" ||
        rawCategory === "Waiting Room"

    return isPublicJobBankKiosk
}

function parseWorkstationRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSTATION_REQUIRED_HEADERS)[number], number>
) {
    // asset tag
    const rawAssetTag = getCellString(row, headerToCol, "Computer Number")
    assertAssetTag(rawAssetTag, rowNumber)

    return {
        asset_tag: rawAssetTag,
    }
}
