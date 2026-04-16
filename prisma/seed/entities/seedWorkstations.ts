import path from "path";
import {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertAssetTag} from "../validators/workstations.validators";
import {assertNoDuplicates} from "../shared/assertions";
import {
    buildEmployeeResolutionContext,
    EmployeeResolutionContext,
    resolveEmployeeId
} from "../shared/employees";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
)

const WORKSTATION_REQUIRED_HEADERS = [
    "OfficeNum",
    "Computer Number",
    "IDIR",
    "Assigned To",
    "Workspace Category"
] as const

type ParsedWorkstationRow = {
    asset_tag: string
    employee_id: number | null
}

export async function seedWorkstations(prismaClient: PrismaClient) {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        computersAndLaptopsWorksheet,
        WORKSTATION_REQUIRED_HEADERS
    )

    const employeeResolutionContext = await buildEmployeeResolutionContext(prismaClient)

    const finalWorkstationRows: ParsedWorkstationRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        const rawAssetTag = getCellString(row, headerToCol, "Computer Number")

        if (!rawAssetTag) continue

        if (ignoreForNow(row, headerToCol)) continue

        const workstationData = parseWorkstationRow(
            row,
            r,
            headerToCol,
            employeeResolutionContext,
        )

        finalWorkstationRows.push(workstationData)
    }

    assertNoDuplicates(
        finalWorkstationRows,
        {
            getKey: row => row.asset_tag,
            label: "workstation asset_tag",
            caseInsensitive: true,
        })

    assertNoDuplicates(
        finalWorkstationRows,
        {
            getKey: row => row.employee_id!,
            label: "workstation employee_id",
            shouldSkip: row => row.employee_id == null
        }
    )

    const assignedCount = finalWorkstationRows.filter(row => row.employee_id != null).length
    console.log(`Prepared ${finalWorkstationRows.length} workstation rows for insert, ${assignedCount} assigned to employees`)

    await prismaClient.workstation.createMany({
        data: finalWorkstationRows
    })
}

function ignoreForNow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSTATION_REQUIRED_HEADERS)[number], number>
) {
    const rawCategory = getCellString(row, headerToCol, "Workspace Category")
    const rawAssignedTo = getCellString(row, headerToCol, "Assigned To")

    const isPublicJobBankKiosk =
        rawAssignedTo === "PUBLIC JobBank Kiosk" ||
        rawCategory === "Waiting Room"

    return isPublicJobBankKiosk
}

function parseWorkstationRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSTATION_REQUIRED_HEADERS)[number], number>,
    employeeResolutionContext: EmployeeResolutionContext
): ParsedWorkstationRow {
    // asset tag
    const rawAssetTag = getCellString(row, headerToCol, "Computer Number")
    assertAssetTag(rawAssetTag, rowNumber)

    // internal employee id i.e. primary key
    const employeeId = resolveEmployeeId(
        row,
        rowNumber,
        headerToCol,
        {
            assignedToHeader: "Assigned To",
            idirHeader: "IDIR",
            officeNumberHeader: "OfficeNum",
            employeeResolutionContext
        }
    )

    return {
        asset_tag: rawAssetTag,
        employee_id: employeeId,
    }
}
