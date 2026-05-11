import ExcelJS from "exceljs";
import {getCellString} from "./excel";


type MobileDeviceRowHeaders =
    | "Hardware"

type MobileDeviceAssignedEmployeeHeaders =
    | "Assigned To"
    | "IDIR"

export const NON_EMPLOYEE_MOBILE_DEVICE_ASSIGNED_TO = "REDEPLOY"
export const NON_EMPLOYEE_MOBILE_DEVICE_IDIR = "REASSIGN"

export function isNotAMobileDeviceRow<THeader extends MobileDeviceRowHeaders>(
    row: ExcelJS.Row,
    headerToCol: Record<THeader, number>
) {
    const hardware = getCellString(row, headerToCol, "Hardware")

    // Rows without Hardware are plan-only records, like cancellation/suspension rows.
    // They are not physical devices and will be modeled later when we add plan/phone-number fields.
    return !hardware
}

export function isNotAnEmployeeMobileDeviceAssignment<THeader extends MobileDeviceAssignedEmployeeHeaders>(
    row: ExcelJS.Row,
    headerToCol: Record<THeader, number>
) {

    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const idir = getCellString(row, headerToCol, "IDIR")

    return (
        assignedTo === NON_EMPLOYEE_MOBILE_DEVICE_ASSIGNED_TO &&
        idir === NON_EMPLOYEE_MOBILE_DEVICE_IDIR
    )
}
