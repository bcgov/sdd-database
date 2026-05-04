import path from "path";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";


const MOBILE_DEVICES_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Devices.xlsx"
)

const MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS = [
    "IMEI",
    "Notes"
] as const

export async function checkMobileDevices() {
    const mobileDevicesWorksheet = await loadWorksheetFromFile(MOBILE_DEVICES_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        mobileDevicesWorksheet,
        MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS
    )

    for (let r = 2; r <= mobileDevicesWorksheet.rowCount; r++) {
        const row = mobileDevicesWorksheet.getRow(r)

        assertBlankIMEIHasNotes(
            row,
            r,
            headerToCol
        )
    }
}

function assertBlankIMEIHasNotes(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
) {
    const imei = getCellString(row, headerToCol, "IMEI")
    const notes = getCellString(row, headerToCol, "Notes")

    if (imei) return
    if (notes) return

    throw new Error(
        `Mobile Devices.xlsx row ${rowNumber} has blank IMEI and blank Notes at row ${rowNumber}`
    )
}
