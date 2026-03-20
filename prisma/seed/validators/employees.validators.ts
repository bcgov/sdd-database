import {assertMaxLength, assertNonEmpty} from "./common.validators";


export function assertIdir(idir: string, rowNumber: number) {
    const label = "IDIR"

    assertMaxLength(idir, label, rowNumber, 8)

    if(!/^[A-Z0-9]*$/.test(idir)) {
        throw new Error(`${label} must contain only uppercase letters and numbers (got "${idir}" at row ${rowNumber})`)
    }
}

export function assertEmployeeId(employeeId: string, rowNumber: number) {
    const label = "Employee ID"

    if(employeeId.length !== 6) {
        throw new Error(`${label} must be exactly 6 digits (got (${employeeId.length} chars)  at row ${rowNumber})`)
    }

    if (/\D/.test(employeeId)) {
        throw new Error(`${label} can only contain digits (0–9) (got "${employeeId}" at row ${rowNumber})`)
    }
}

export function assertName(name: string, label: string, rowNumber: number) {
    assertNonEmpty(name, label, rowNumber)
    assertMaxLength(name, label, rowNumber, 30)

    const regexPattern = /^$|^[A-Za-z]+(?:[-'][A-Za-z]+)*\.?(?: [A-Za-z]+(?:[-'][A-Za-z]+)*\.?)*$/

    if (!regexPattern.test(name)) {
        throw new Error(
            `${label} can contain only alphabets, apostrophes or hyphens within words, optional periods after words and single spaces in between words (got "${name}" at row ${rowNumber})`
        )
    }
}

export function assertNotes(notes: string, rowNumber: number) {
    assertMaxLength(notes, "Notes", rowNumber, 2000)
}
