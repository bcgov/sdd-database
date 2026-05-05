import ExcelJS from "exceljs";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {assertOfficeNumber} from "../validators/offices.validators";
import path from "path";


const OFFICE_INFORMATION_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Office Information.xlsx"
)

const OFFICE_INFORMATION_SOURCE_INTEGRITY_HEADERS = [
    "OfficeNum",
] as const

export async function buildValidOfficeNumbersFromOfficeInformation() {
    const officeInformationWorksheet = await loadWorksheetFromFile(OFFICE_INFORMATION_FILE_PATH)

    const officeInformationHeaderToCol = getRequiredHeaderToCol(
        officeInformationWorksheet,
        OFFICE_INFORMATION_SOURCE_INTEGRITY_HEADERS
    )

    return buildOfficeNumberSetFromOfficeInformation(
        officeInformationWorksheet,
        officeInformationHeaderToCol
    )
}

function buildOfficeNumberSetFromOfficeInformation(
    worksheet: ExcelJS.Worksheet,
    headerToCol: Record<(typeof OFFICE_INFORMATION_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const officeNumbers = new Set<string>()

    for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r)

        const officeNumber = getCellString(row, headerToCol, "OfficeNum")
        assertOfficeNumber(officeNumber, r)

        officeNumbers.add(officeNumber)
    }

    return officeNumbers
}

export function assertOfficeNumberExistsInOfficeInformation(
    officeNumber: string,
    rowNumber: number,
    sourceFileName: string,
    validOfficeNumbers: Set<string>
) {
    assertOfficeNumber(officeNumber, rowNumber)

    if (!validOfficeNumbers.has(officeNumber)) {
        throw new Error(
            `OfficeNum "${officeNumber}" at row ${rowNumber} in ${sourceFileName} does not exist in Office Information.xlsx`
        )
    }
}
