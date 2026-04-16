import path from "path";
import {PrismaClient} from "@/generated/prisma/client"
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import {buildIdLookupByName, idNameSelect} from "../shared/lookups";
import {assertLookupValue, assertUnique} from "../validators/common.validators";
import {assertNoDuplicates} from "../shared/assertions";
import {
    buildEmployeeResolutionContext,
    resolveEmployeeId
} from "../shared/employees";
import {normalizeCategoryName} from "../normalizers/workspaces.normalizers";
import {normalizeAccommodationName} from "../normalizers/ohs.normalizers";


const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
)

const REQUIRED_HEADERS = [
    "OfficeNum",
    "IDIR",
    "Assigned To",
    "OHS Non-Standard Ergo Equipment"
] as const

type ParsedEmployeeOhsAccommodationRow = {
    employee_id: number
    ohs_accommodation_type_id: number
}

export async function seedEmployeeOhsAccommodations(prismaClient: PrismaClient) {
    const worksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)
    const headerToCol = getRequiredHeaderToCol(worksheet, REQUIRED_HEADERS)

    const ohsAccommodationTypeLookup = buildIdLookupByName(
        await prismaClient.ohsAccommodationType.findMany({
            select: idNameSelect
        })
    )

    const employeeResolutionContext = await buildEmployeeResolutionContext(prismaClient)

    const finalRowsToInsert: ParsedEmployeeOhsAccommodationRow[] = []

    for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r)

        const rawOhsEquipment = getCellString(row, headerToCol, "OHS Non-Standard Ergo Equipment")
        if (!rawOhsEquipment) continue

        const employeeId = resolveEmployeeId(
            row,
            r,
            headerToCol,
            {
                assignedToHeader: "Assigned To",
                idirHeader: "IDIR",
                officeNumberHeader: "OfficeNum",
                employeeResolutionContext
            })

        if (employeeId === null) {
            throw new Error(`OHS Accommodation found in a non-employee record at rowNumber ${r}`)
        }

        const parsedAccommodationNames = parseAndAssertOhsAccommodationNames(rawOhsEquipment, r)

        for (const accommodationName of parsedAccommodationNames) {

            const normalizedAccommodationName = normalizeAccommodationName(accommodationName)

            const accommodationTypeId = assertLookupValue(
                normalizedAccommodationName,
                "OHS Accommodation Type",
                r,
                ohsAccommodationTypeLookup
            )

            finalRowsToInsert.push({
                employee_id: employeeId,
                ohs_accommodation_type_id: accommodationTypeId
            })
        }
    }

    assertNoDuplicates(
        finalRowsToInsert,
        {
            getKey: row => `${row.employee_id}::${row.ohs_accommodation_type_id}`,
            label: "employee OHS accommodation pair"
        }
    )

    console.log(`Prepared ${finalRowsToInsert.length} employee OHS accommodation rows for insert`)

    await prismaClient.employeeOhsAccommodation.createMany({
        data: finalRowsToInsert
    })
}

function parseAndAssertOhsAccommodationNames(rawValue: string, rowNumber: number) {
    if (!rawValue) {
        return []
    }

    if (rawValue.trim() !== rawValue) {
        throw new Error(
            `OHS Accommodation value at row ${rowNumber} has leading or trailing spaces. Please use the format "Category 1, Category 2"`
        )
    }

    if (rawValue.includes(" ,")) {
        throw new Error(
            `OHS Accommodation value at row ${rowNumber} has an extra space before a comma. Please use exactly "Category 1, Category 2".`
        )
    }

    if (rawValue.includes(",  ")) {
        throw new Error(
            `OHS Accommodation value at row ${rowNumber} has extra spaces after a comma. Please use exactly one space after each comma`
        )
    }

    if (rawValue.includes(",") && !rawValue.includes(", ")) {
        throw new Error(
            `OHS Accommodation value at row ${rowNumber} is incorrectly formatted. ` +
            `Please separate values using comma + single space, for example "Mouse, Keyboard".`
        )
    }

    const values = rawValue.split(", ")

    if (values.some(value => value.length === 0)) {
        throw new Error(
            `OHS Accommodation value at row ${rowNumber} contains an empty category.`
        )
    }

    const seenValues = new Map<string, number>()

    for (const value of values) {
        assertUnique(
            seenValues,
            value,
            rowNumber,
            "OHS Accommodation Type"
        )
    }

    return values
}
