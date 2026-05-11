import path from "path";
import ExcelJS from "exceljs";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {isPublicJobBankKiosk} from "../shared/sourceRows";
import {isLeaveWorkspaceNumber, isNonResidentWorkspaceAssignmentType, isNotAnEmployeeRow} from "../shared/employees";
import {assertWorkspaceNumber} from "../validators/workspaces.validators";
import {assertOfficeNumberExistsInOfficeInformation, buildValidOfficeNumbersFromOfficeInformation} from "./shared";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
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

export async function checkComputersAndLaptops() {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const computersAndLaptopsHeaderToCol = getRequiredHeaderToCol(
        computersAndLaptopsWorksheet,
        COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS
    )

    const validOfficeNumbers = await buildValidOfficeNumbersFromOfficeInformation()

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (!row.hasValues) continue

        const officeNumber = getCellString(row, computersAndLaptopsHeaderToCol, "OfficeNum")

        assertOfficeNumberExistsInOfficeInformation(
            officeNumber,
            r,
            "Computers and Laptops.xlsx",
            validOfficeNumbers
        )

        assertWorkspaceFieldsMatchWorkspaceNumber(row, r, computersAndLaptopsHeaderToCol)
    }
}

function assertWorkspaceFieldsMatchWorkspaceNumber(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof COMPUTERS_AND_LAPTOPS_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    if (isPublicJobBankKiosk(row, headerToCol)) return
    if (isNotAnEmployeeRow(row, headerToCol, "Assigned To")) return

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
        throw new Error(
            `Employee row at row ${rowNumber} has a blank Workspace Number. Use "Leave" for employees on leave, or use a valid workspace number / non-resident assignment type.`
        )
    }

    if (isLeaveWorkspaceNumber(rawWorkspaceNumber)) {
        if (populatedWorkspaceFields.length > 0) {
            throw new Error(
                `Workspace Number ${rawWorkspaceNumber} at row ${rowNumber} indicates leave, so workspace fields should be blank. Please clear: ${populatedWorkspaceFields.map(field => field.label).join(", ")}.`
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
