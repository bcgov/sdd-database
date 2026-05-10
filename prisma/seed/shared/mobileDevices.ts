import ExcelJS from "exceljs";
import {getCellString} from "./excel";


type MobileDeviceRowHeaders =
    | "Hardware"

export function isNotAMobileDeviceRow<THeader extends MobileDeviceRowHeaders>(
    row: ExcelJS.Row,
    headerToCol: Record<THeader, number>
) {
    const hardware = getCellString(row, headerToCol, "Hardware")

    // Rows without Hardware are plan-only records, like cancellation/suspension rows.
    // They are not physical devices and will be modeled later when we add plan/phone-number fields.
    return !hardware
}
