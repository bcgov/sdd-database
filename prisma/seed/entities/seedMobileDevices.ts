import path from "path";
import {PrismaClient} from "@/generated/prisma/client";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertImei} from "../validators/mobileDevices.validators";
import {assertNoDuplicates} from "../shared/assertions";
import {assertLookupValue, assertNotes} from "../validators/common.validators";
import {assertOfficeNumber} from "../validators/offices.validators";
import {buildIdLookupByName, idNameSelect} from "../shared/lookups";
import {normalizeMobileDeviceModelName} from "../normalizers/mobileDevices.normalizers";
import {isNotAMobileDeviceRow} from "../shared/mobileDevices";


const MOBILE_DEVICES_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Devices.xlsx"
)

const MOBILE_DEVICES_REQUIRED_HEADERS = [
    "OfficeNum",
    "IMEI",
    "Notes",
    "Hardware"
] as const

type ParsedMobileDeviceRow = {
    imei: string | null
    notes: string | null
    model_id: number
    office_number: string
}

export async function seedMobileDevices(prismaClient: PrismaClient) {
    const mobileDevicesWorksheet = await loadWorksheetFromFile(MOBILE_DEVICES_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        mobileDevicesWorksheet,
        MOBILE_DEVICES_REQUIRED_HEADERS
    )

    const modelLookup = buildIdLookupByName(
        await prismaClient.mobileDeviceModel.findMany({
            select: idNameSelect
        })
    )

    const finalMobileDeviceRows: ParsedMobileDeviceRow[] = []

    for (let r = 2; r <= mobileDevicesWorksheet.rowCount; r++) {
        const row = mobileDevicesWorksheet.getRow(r)

        if (isNotAMobileDeviceRow(row, headerToCol)) continue

        const mobileDeviceData = parseMobileDeviceRow(
            row,
            r,
            headerToCol,
            modelLookup
        )

        finalMobileDeviceRows.push(mobileDeviceData)
    }

    assertNoDuplicates(
        finalMobileDeviceRows,
        {
            getKey: row => row.imei!,
            label: "mobile device IMEI",
            shouldSkip: row => !row.imei
        }
    )

    console.log(`Prepared ${finalMobileDeviceRows.length} mobile device rows for insert`)

    await prismaClient.mobileDevice.createMany({
        data: finalMobileDeviceRows
    })
}

function parseMobileDeviceRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_REQUIRED_HEADERS)[number], number>,
    modelLookup: Map<string, number>
): ParsedMobileDeviceRow {

    // IMEI
    const rawImei = getCellString(row, headerToCol, "IMEI")
    const imei = rawImei || null
    if (imei) assertImei(imei, rowNumber)

    // notes
    const rawNotes = getCellString(row, headerToCol, "Notes")
    assertNotes(rawNotes, rowNumber)
    const notes = rawNotes || null   // making sure to store null instead of ""

    // model
    const rawHardware = getCellString(row, headerToCol, "Hardware")
    const hardware = normalizeMobileDeviceModelName(rawHardware)
    const modelId = assertLookupValue(hardware, "Hardware", rowNumber, modelLookup)

    // office_number
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(officeNumber, rowNumber)

    return {
        imei,
        notes,
        model_id: modelId,
        office_number: officeNumber
    }
}
