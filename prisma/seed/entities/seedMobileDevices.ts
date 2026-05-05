import path from "path";
import {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertImei} from "../validators/mobileDevices.validators";
import {assertNoDuplicates} from "../shared/assertions";
import {assertNotes} from "../validators/common.validators";
import {assertOfficeNumber} from "../validators/offices.validators";


const MOBILE_DEVICES_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Devices.xlsx"
)

const MOBILE_DEVICES_REQUIRED_HEADERS = [
    "OfficeNum",
    "IMEI",
    "Notes"
] as const

type ParsedMobileDeviceRow = {
    imei: string
    notes: string | null
    office_number: string
}

export async function seedMobileDevices(prismaClient: PrismaClient) {
    const mobileDevicesWorksheet = await loadWorksheetFromFile(MOBILE_DEVICES_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        mobileDevicesWorksheet,
        MOBILE_DEVICES_REQUIRED_HEADERS
    )

    const finalMobileDeviceRows: ParsedMobileDeviceRow[] = []

    for (let r = 2; r <= mobileDevicesWorksheet.rowCount; r++) {
        const row = mobileDevicesWorksheet.getRow(r)

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

    return !imei
}

function parseMobileDeviceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_REQUIRED_HEADERS)[number], number>
): ParsedMobileDeviceRow {

    // IMEI
    const imei = getCellString(row, headerToCol, "IMEI")
    assertImei(imei, rowNumber)

    // notes
    const rawNotes = getCellString(row, headerToCol, "Notes")
    assertNotes(rawNotes, rowNumber)
    const notes = rawNotes || null   // making sure to store null instead of ""

    // office_number
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(officeNumber, rowNumber)

    return {
        imei,
        office_number: officeNumber,
        notes
    }
}
