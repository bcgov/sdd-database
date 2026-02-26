export function assertNonEmpty(value: string, label: string, rowNumber: number) {
    if (!value) {
        throw new Error(`Missing ${label} at row ${rowNumber}`)
    }
}

export function assertUnique(seenList: Map<string, number>, keyToCheck: string, rowNumber: number, labelForError: string) {
    const duplicateKeyFirstSeenAt = seenList.get(keyToCheck)

    if (duplicateKeyFirstSeenAt !== undefined) {
        throw new Error(`Duplicate ${labelForError} "${keyToCheck}" at row ${rowNumber}. First seen at row ${duplicateKeyFirstSeenAt}`)
    }

    seenList.set(keyToCheck, rowNumber)
}

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

    assertNonEmpty(officeName, "Office Name", rowNumber)

    const MAX_LENGTH = 35

    if (officeName.length > MAX_LENGTH) {
        throw new Error(`Office Name too long (${officeName.length} chars) at row ${rowNumber}. Max is ${MAX_LENGTH} chars. Value: "${officeName}"`)
    }
}

export function assertOfficeAddress(officeAddress: string, rowNumber: number) {

    assertNonEmpty(officeAddress, "Office Address", rowNumber)

    const MAX_LENGTH = 45

    if (officeAddress.length > MAX_LENGTH) {
        throw new Error(`Office Address too long (${officeAddress.length} chars) at row ${rowNumber}. Max is ${MAX_LENGTH} chars. Value: "${officeAddress}"`)
    }
}

export function assertCity(city: string, rowNumber: number) {

    assertNonEmpty(city, "Office Location", rowNumber)

    const MAX_LENGTH = 20

    if (city.length > MAX_LENGTH) {
        throw new Error(`Office Location too long (${city.length} chars) at row ${rowNumber}. Max is ${MAX_LENGTH} chars. Value: "${city}"`)
    }
}

export function assertPostalCode(postalCode: string, rowNumber: number) {

    assertNonEmpty(postalCode, "Postal Code", rowNumber)

    // Enforce Canadian format: A1A 1A1
    if (!/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(postalCode)) {
        throw new Error(`Postal Code must be in Canadian format "A1A 1A1" (got "${postalCode}" at row ${rowNumber}).`)
    }
}
