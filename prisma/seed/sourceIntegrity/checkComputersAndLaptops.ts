import path from "path";
import ExcelJS from "exceljs";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {isPublicJobBankKiosk} from "../shared/sourceRows";
import {assertOfficeNumber} from "../validators/offices.validators";
import {isNonResidentWorkspaceAssignmentType, isNotAnEmployeeRow} from "../shared/employees";
import {assertWorkspaceNumber} from "../validators/workspaces.validators";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
);

const OFFICE_INFORMATION_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Office Information.xlsx"
)

const COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS = [
    "OfficeNum",
    "Assigned To",
    "Status",
    "Hardware",
    "Workspace Number",
    "Workspace Type",
    "OfficeFloor",
    "Workspace Category",
    "DeskType"
] as const

const OFFICE_INFORMATION_SOURCE_INTEGRITY_HEADERS = [
    "OfficeNum",
] as const;

export async function checkComputersAndLaptops() {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)
    const officeInformationWorksheet = await loadWorksheetFromFile(OFFICE_INFORMATION_FILE_PATH)

    const computersAndLaptopsHeaderToCol = getRequiredHeaderToCol(
        computersAndLaptopsWorksheet,
        COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS
    )

    const officeInformationHeaderToCol = getRequiredHeaderToCol(
        officeInformationWorksheet,
        OFFICE_INFORMATION_SOURCE_INTEGRITY_HEADERS
    )

    const validOfficeNumbers = buildOfficeNumberSetFromOfficeInformation(
        officeInformationWorksheet,
        officeInformationHeaderToCol
    )

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (!row.hasValues) continue

        assertOfficeNumberExistsInOfficeInformation(
            row,
            r,
            computersAndLaptopsHeaderToCol,
            validOfficeNumbers
        )

        if (isPublicJobBankKiosk(row, computersAndLaptopsHeaderToCol)) continue

        assertWorkspaceFieldsMatchWorkspaceNumber(
            row,
            r,
            computersAndLaptopsHeaderToCol
        )

        assertBlankWorkspaceNumberEmployeeHasLeaveStatus(
            row,
            r,
            computersAndLaptopsHeaderToCol
        )
    }
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

function assertOfficeNumberExistsInOfficeInformation(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS)[number], number>,
    validOfficeNumbers: Set<string>
) {
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(officeNumber, rowNumber)

    if (!validOfficeNumbers.has(officeNumber)) {
        throw new Error(
            `OfficeNum "${officeNumber}" at row ${rowNumber} in Computers and Laptops.xlsx does not exist in Office Information.xlsx`
        )
    }
}

function assertWorkspaceFieldsMatchWorkspaceNumber(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")

    const workspaceFields = [
        {
            label: "Workspace Type",
            value: getCellString(row, headerToCol, "Workspace Type"),
        },
        {
            label: "Office Floor",
            value: getCellString(row, headerToCol, "OfficeFloor"),
        },
        {
            label: "Workspace Category",
            value: getCellString(row, headerToCol, "Workspace Category"),
        },
        {
            label: "Desk Type",
            value: getCellString(row, headerToCol, "DeskType"),
        }
    ]

    const populatedWorkspaceFields = workspaceFields.filter(field => field.value)

    if (!rawWorkspaceNumber) {
        if (populatedWorkspaceFields.length > 0) {
            throw new Error(
                `Workspace Number is blank at row ${rowNumber}, so workspace fields should also be blank. Please clear: ${populatedWorkspaceFields.map(field => field.label).join(", ")}.`
            )
        }

        return
    }

    if (isNonResidentWorkspaceAssignmentType(rawWorkspaceNumber)) {
        if (populatedWorkspaceFields.length > 0) {
            throw new Error(
                `Workspace Number ${rawWorkspaceNumber} at row ${rowNumber} is a non-resident assignment type, so workspace fields should be blank. Please clear: ${populatedWorkspaceFields.map(field => field.label).join(", ")}.`
            )
        }
        return
    }

    // if we reach this step then this is indeed a resident space
    assertWorkspaceNumber(rawWorkspaceNumber, rowNumber)
}

function assertBlankWorkspaceNumberEmployeeHasLeaveStatus(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS)[number], number>,
) {
    const rawWorkspaceNumber = getCellString(row, headerToCol, "Workspace Number")
    const rawStatus = getCellString(row, headerToCol, "Status")

    if (rawWorkspaceNumber) return

    if (isNotAnEmployeeRow(row, headerToCol, "Assigned To")) return

    if (isLeaveLikeStatus(rawStatus)) return

    throw new Error(
        `Employee row at row ${rowNumber} has a blank Workspace Number, but Status does not indicate leave/LTD. Status='${rawStatus}'`
    )
}

function isLeaveLikeStatus(status: string) {
    return (
        /\bLTD\b/.test(status) ||
        /^Leave\b/.test(status)
    )
}
