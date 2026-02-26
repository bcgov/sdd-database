import type {PrismaClient} from "@/generated/prisma/client"

import path from "path"

import type ExcelJS from "exceljs";

import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../excel";

import {
    assertCity, assertLookupValue,
    assertOfficeAddress,
    assertOfficeName,
    assertOfficeNumber,
    assertPostalCode, assertUnique,
} from "../offices.validators";


const EXCEL_FILE_PATH = path.join(process.cwd(), "prisma", "data", "Office Information.xlsx")

const REQUIRED_HEADERS = [
    "OfficeNum",
    "Office Name",
    "Office Address",
    "Office Location",
    "Postal Code",
    "Type of Office",
    "Type of Client Services",
] as const;


export async function seedOffices(prismaClient: PrismaClient) {

    const worksheet = await loadWorksheetFromFile(EXCEL_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(worksheet, REQUIRED_HEADERS)

    const seenOfficeNumbers = new Map<string, number>();

    const officeTypeLookup = buildLookup(
        await prismaClient.officeType.findMany({
            select: {
                id: true,
                name: true,
            },
        })
    )
    const clientServiceTypeLookup = buildLookup(
        await prismaClient.typeOfClientService.findMany({
            select: {
                id: true,
                name: true,
            },
        })
    )

    for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r)

        // skip fully empty rows
        if (!row.hasValues) continue

        const officeData = parseOfficeRow(
            row,
            r,
            headerToCol,
            seenOfficeNumbers,
            officeTypeLookup,
            clientServiceTypeLookup
        )

        await prismaClient.office.upsert({
            where: {
                office_number: officeData.office_number
            },
            update: {
                office_name: officeData.office_name,
                type_id: officeData.type_id,
                client_service_type_id: officeData.client_service_type_id,
                address: officeData.address,
                city: officeData.city,
                postal_code: officeData.postal_code,
            },
            create: officeData
        })
    }
}

function buildLookup(rows: Array<{ id: number; name: string }>) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        lookup.set(row.name, row.id)
    }

    return lookup
}

function parseOfficeRow(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof REQUIRED_HEADERS)[number], number>,
    seenOfficeNumbers: Map<string, number>,
    officeTypeLookup: Map<string, number>,
    clientServiceTypeLookup: Map<string, number>,
) {
    // office number
    const officeNumberString = getCellString(row, headerToCol, "OfficeNum")
    assertOfficeNumber(officeNumberString, rowNumber)
    assertUnique(seenOfficeNumbers, officeNumberString, rowNumber, "office number")

    // office name
    const officeNameString = getCellString(row, headerToCol, "Office Name")
    assertOfficeName(officeNameString, rowNumber)

    // office address
    const address = getCellString(row, headerToCol, "Office Address")
    assertOfficeAddress(address, rowNumber)

    // city (Excel header: Office Location)
    const city = getCellString(row, headerToCol, "Office Location")
    assertCity(city, rowNumber)

    // postal code
    const postalCode = getCellString(row, headerToCol, "Postal Code")
    assertPostalCode(postalCode, rowNumber)

    // type of office
    const officeType = getCellString(row, headerToCol, "Type of Office")
    const officeTypeId = assertLookupValue(officeType, "Type of Office", rowNumber, officeTypeLookup)

    // type of client services
    const clientServiceType = getCellString(row, headerToCol, "Type of Client Services")
    const clientServiceTypeId = assertLookupValue(clientServiceType, "Type of Client Services", rowNumber, clientServiceTypeLookup)

    return {
        office_number: officeNumberString,
        office_name: officeNameString,
        type_id: officeTypeId,
        client_service_type_id: clientServiceTypeId,
        address,
        city,
        postal_code: postalCode,
    }
}
