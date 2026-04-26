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
import {buildIdLookupByName, idNameSelect} from "../shared/lookups";
import {assertLookupValue, assertNotes} from "../validators/common.validators";
import {normalizeModelName} from "../normalizers/workstations.normalizers";
import {isPublicJobBankKiosk} from "../shared/sourceRows";
import {assertOfficeNumber} from "../validators/offices.validators";


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
    "Status",
    "Hardware",
    "Workspace Category"
] as const

type ParsedWorkstationRow = {
    asset_tag: string
    model_id: number
    office_number: string
    employee_id: number | null
    notes: string | null
}

export async function seedWorkstations(prismaClient: PrismaClient) {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        computersAndLaptopsWorksheet,
        WORKSTATION_REQUIRED_HEADERS
    )

    const modelLookup = buildIdLookupByName(
        await prismaClient.workstationModel.findMany({
            select: idNameSelect
        })
    )

    const employeeResolutionContext = await buildEmployeeResolutionContext(prismaClient)

    const finalWorkstationRows: ParsedWorkstationRow[] = []

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (isPublicJobBankKiosk(row, headerToCol)) continue

        if (isNotAWorkstationRow(row, headerToCol)) continue

        const workstationData = parseWorkstationRow(
            row,
            r,
            headerToCol,
            modelLookup,
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

    const assignedCount = finalWorkstationRows.filter(row => row.employee_id != null).length
    console.log(`Prepared ${finalWorkstationRows.length} workstation rows for insert, ${assignedCount} assigned to employees`)

    await prismaClient.workstation.createMany({
        data: finalWorkstationRows
    })
}

function isNotAWorkstationRow(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof WORKSTATION_REQUIRED_HEADERS)[number], number>
) {
    const rawAssetTag = getCellString(row, headerToCol, "Computer Number")
    const rawHardware = getCellString(row, headerToCol, "Hardware")

    return !rawAssetTag && !rawHardware
}

function parseWorkstationRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof WORKSTATION_REQUIRED_HEADERS)[number], number>,
    modelLookup: Map<string, number>,
    employeeResolutionContext: EmployeeResolutionContext
): ParsedWorkstationRow {

    // model
    const rawHardware = getCellString(row, headerToCol, "Hardware")
    const hardware = normalizeModelName(rawHardware)
    const modelId = assertLookupValue(hardware, "Hardware", rowNumber, modelLookup)

    // asset tag
    const rawAssetTag = getCellString(row, headerToCol, "Computer Number")
    assertAssetTag(rawAssetTag, hardware, rowNumber)

    // office_number
    const officeNumberHeader = "OfficeNum"
    const officeNumber = getCellString(row, headerToCol, officeNumberHeader)
    assertOfficeNumber(officeNumber, rowNumber)

    // internal employee id i.e. primary key
    const employeeId = resolveEmployeeId(
        row,
        rowNumber,
        headerToCol,
        {
            assignedToHeader: "Assigned To",
            idirHeader: "IDIR",
            officeNumberHeader,
            employeeResolutionContext
        }
    )

    // notes
    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const shouldSeedNotes = assignedTo === "REDEPLOY"

    const rawNotes = getCellString(row, headerToCol, "Status")
    assertNotes(rawNotes, rowNumber)

    const notes = shouldSeedNotes
        ? (rawNotes || null)   // making sure to store null instead of ""
        : null

    return {
        asset_tag: rawAssetTag,
        model_id: modelId,
        office_number: officeNumber,
        employee_id: employeeId,
        notes
    }
}
