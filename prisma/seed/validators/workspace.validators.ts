import {assertNonEmpty} from "./common.validators";

export function assertWorkspaceNumber(workspaceNumber: string, rowNumber: number) {
    const label = "Workspace Number"

    assertNonEmpty(workspaceNumber, label, rowNumber)

    const validLengths = [3, 4];

    if (!validLengths.includes(workspaceNumber.length)) {
        throw new Error(`${label} must be exactly 3 or 4 characters long (got "${workspaceNumber}" at row ${rowNumber})`)
    }
}

export function parseAndAssertOfficeFloor(officeFloor: string, rowNumber: number) {
    const label = "Office Floor"

    assertNonEmpty(officeFloor, label, rowNumber)

    const match = officeFloor.match(/^(\d+)(st|nd|rd|th)\s+Floor$/)
    if (!match) {
        throw new Error(
            `${label} "${officeFloor}" at row ${rowNumber} is invalid. Expected values like "1st Floor", "2nd Floor", "18th Floor".`
        )
    }
    return Number(match[1])
}

export function assertWorkspaceNumberMatchesOfficeFloor(
    workspaceNumber: string,
    officeFloor: number,
    officeNumber: string,
    rowNumber: number
) {
    const expectedPrefix = String(officeFloor)

    const isOffice350FourthFloorOverflow =
        officeNumber === "350" &&
        officeFloor === 4 &&
        workspaceNumber.startsWith("5")

    if (workspaceNumber.startsWith(expectedPrefix) || isOffice350FourthFloorOverflow) {
        return
    }

    throw new Error(
        `Workspace Number ${workspaceNumber} does not align with Office Floor "${officeFloor}" at row ${rowNumber}.`
    )
}
