import path from "path";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertOfficeNumber} from "../validators/offices.validators";
import {assertOfficeNumberExistsInOfficeInformation, buildValidOfficeNumbersFromOfficeInformation} from "./shared";
import {assertImei} from "../validators/mobileDevices.validators";


const MOBILE_DEVICES_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Devices.xlsx"
)

const MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS = [
    "OfficeNum",
    "IMEI",
    "Notes",
    "Hardware"
] as const

const HARDWARE_WITHOUT_IMEI = new Set<string>([
    "OiaB",
    "Qualcomm GSP-1700"
])

export async function checkMobileDevices() {
    const mobileDevicesWorksheet = await loadWorksheetFromFile(MOBILE_DEVICES_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        mobileDevicesWorksheet,
        MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS
    )

    const validOfficeNumbers = await buildValidOfficeNumbersFromOfficeInformation()

    for (let r = 2; r <= mobileDevicesWorksheet.rowCount; r++) {
        const row = mobileDevicesWorksheet.getRow(r)

        assertPopulatedOfficeNumberExistsInOfficeInformation(row, r, headerToCol, validOfficeNumbers)
        assertHardwareImeiRules(row, r, headerToCol)
        assertBlankImeiHasNotes(row, r, headerToCol)
        assertImeiRowsHaveOfficeNumber(row, r, headerToCol)
    }
}

/**
 * Any non-empty OfficeNum must exist in Office Information.xlsx
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 * @param validOfficeNumbers
 */
function assertPopulatedOfficeNumberExistsInOfficeInformation(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
    validOfficeNumbers: Set<string>
) {
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")

    if (officeNumber) {
        assertOfficeNumberExistsInOfficeInformation(
            officeNumber,
            rowNumber,
            "Mobile Devices.xlsx",
            validOfficeNumbers
        )
    }
}

/**
 * If IMEI is blank, Notes must not be blank.
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 */
function assertBlankImeiHasNotes(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const imei = getCellString(row, headerToCol, "IMEI")
    const notes = getCellString(row, headerToCol, "Notes")

    if (imei) return
    if (notes) return

    throw new Error(
        `Mobile Devices.xlsx row ${rowNumber} has blank IMEI and blank Notes. If IMEI is blank, Notes should explain why.`
    )
}

/**
 * If IMEI is present, OfficeNum must not be blank and must be valid
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 */
function assertImeiRowsHaveOfficeNumber(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const imei = getCellString(row, headerToCol, "IMEI")
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")

    if (!imei) return

    assertOfficeNumber(officeNumber, rowNumber)
}

/**
 * Cellular phone hardware must have a valid IMEI
 * Non-cellular hardware must have blank IMEI
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 */
function assertHardwareImeiRules(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const hardware = getCellString(row, headerToCol, "Hardware")
    const imei = getCellString(row, headerToCol, "IMEI")

    if (!hardware) return

    if (HARDWARE_WITHOUT_IMEI.has(hardware)) {
        if (!imei) return

        throw new Error(
            `Mobile Devices.xlsx row ${rowNumber} has Hardware "${hardware}" but IMEI is populated. ${hardware} records should not have an IMEI.`
        )
    }

    assertImei(imei, rowNumber)
}
