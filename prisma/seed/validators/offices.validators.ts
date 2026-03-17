import {assertMaxLength, assertNonEmpty} from "./common.validators";


export function assertLookupValue(rawValue: string, label: string, rowNumber: number, lookup: Map<string, number>) {
    assertNonEmpty(rawValue, label, rowNumber)

    const id = lookup.get(rawValue)

    if (id === undefined) {
        throw new Error(`${label} "${rawValue}" at row ${rowNumber} is not a valid option.`)
    }

    return id
}

export function assertOfficeNumber(officeNumber: string, rowNumber: number) {

    assertNonEmpty(officeNumber, "Office Number", rowNumber)

    if (!/^\d{1,3}$/.test(officeNumber)) {
        throw new Error(`Office Number must be 1 to 3 digits (got ${officeNumber} at row ${rowNumber})`)
    }
}

export function assertOfficeName(officeName: string, rowNumber: number) {
    const label = "Office Name"
    assertNonEmpty(officeName, label, rowNumber)
    assertMaxLength(officeName, label, rowNumber, 35)
}

export function assertOfficeAddress(officeAddress: string, rowNumber: number) {

    const label = "Office Address"
    assertNonEmpty(officeAddress, label, rowNumber)
    assertMaxLength(officeAddress, label, rowNumber, 45)
}

export function assertCity(city: string, rowNumber: number) {

    const label = "Office Location"
    assertNonEmpty(city, label, rowNumber)
    assertMaxLength(city, label, rowNumber, 20)
}

export function assertPostalCode(postalCode: string, rowNumber: number) {

    assertNonEmpty(postalCode, "Postal Code", rowNumber)

    // Enforce Canadian format: A1A 1A1
    if (!/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(postalCode)) {
        throw new Error(`Postal Code must be in Canadian format "A1A 1A1" (got "${postalCode}" at row ${rowNumber}).`)
    }
}
