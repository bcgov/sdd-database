export function assertNonEmpty(value: string, label: string, rowNumber: number) {
    if (!value) {
        throw new Error(`Missing ${label} at row ${rowNumber}`)
    }
}

export function assertUnique(
    seenList: Map<string, number>,
    keyToCheck: string,
    rowNumber: number,
    labelForError: string
) {
    const duplicateKeyFirstSeenAt = seenList.get(keyToCheck)

    if (duplicateKeyFirstSeenAt !== undefined) {
        throw new Error(`Duplicate ${labelForError} "${keyToCheck}" at row ${rowNumber}. First seen at row ${duplicateKeyFirstSeenAt}`)
    }

    seenList.set(keyToCheck, rowNumber)
}

export function assertMaxLength(value: string, label: string, rowNumber: number, maxLength: number) {

    if (value.length > maxLength) {
        throw new Error(`${label} too long (${value.length} chars) at row ${rowNumber}. Max is ${maxLength} chars. Value: "${value}"`)
    }
}

export function assertNotes(notes: string, rowNumber: number) {
    assertMaxLength(notes, "Notes", rowNumber, 2000)
}

export function assertLookupValue(rawValue: string, label: string, rowNumber: number, lookup: Map<string, number>) {
    assertNonEmpty(rawValue, label, rowNumber)

    const id = lookup.get(rawValue)

    if (id === undefined) {
        throw new Error(`${label} "${rawValue}" at row ${rowNumber} is not a valid option.`)
    }

    return id
}
