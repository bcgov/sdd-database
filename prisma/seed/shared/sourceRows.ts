import ExcelJS from "exceljs";
import {getCellString} from "./excel";


type PublicJobBankKioskHeaders =
    | "Workspace Category"
    | "Assigned To"
    | "Hardware"

export function isPublicJobBankKiosk<THeader extends PublicJobBankKioskHeaders>(
    row: ExcelJS.Row,
    headerToCol: Record<THeader, number>
) {
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")
    const rawHardware = getCellString(row, headerToCol, "Hardware")

    return (
        rawAssignedTo === "PUBLIC JobBank Kiosk" ||
        rawCategory === "Waiting Room" ||
        rawHardware === "Kiosk - Thinkcentre M80Q"
    )
}
