import path from "path";
import {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertIMEI} from "../validators/mobileDevices.validators";
import {assertNoDuplicates} from "../shared/assertions";


const MOBILE_DEVICES_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Devices.xlsx"
)

const MOBILE_DEVICES_REQUIRED_HEADERS = [
    "IMEI"
] as const

type ParsedMobileDeviceRow = {
    imei: string
}

export async function seedMobileDevices(prismaClient: PrismaClient) {
    const mobilePhonesWorksheet = await loadWorksheetFromFile(MOBILE_DEVICES_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        mobilePhonesWorksheet,
        MOBILE_DEVICES_REQUIRED_HEADERS
    )

    const finalMobileDeviceRows: ParsedMobileDeviceRow[] = []

    for (let r = 2; r <= mobilePhonesWorksheet.rowCount; r++) {
        const row = mobilePhonesWorksheet.getRow(r)

        if (ignoreForNow(row, headerToCol)) continue

        const mobileDeviceData = parseMobileDeviceRow(
            row,
            r,
            headerToCol
        )

        finalMobileDeviceRows.push(mobileDeviceData)
    }

    assertNoDuplicates(
        finalMobileDeviceRows,
        {
            getKey: row => row.imei,
            label: "mobile device IMEI",
        }
    )

    console.log(`Prepared ${finalMobileDeviceRows.length} mobile device rows for insert`)

    await prismaClient.mobileDevice.createMany({
        data: finalMobileDeviceRows
    })
}

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof MOBILE_DEVICES_REQUIRED_HEADERS)[number], number>
) {
    const imei = getCellString(row, headerToCol, "IMEI")

    if (!imei) return true
}

function parseMobileDeviceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_REQUIRED_HEADERS)[number], number>
): ParsedMobileDeviceRow {

    // IMEI
    const imei = getCellString(row, headerToCol, "IMEI")
    assertIMEI(imei, rowNumber)

    return {
        imei
    }
}
