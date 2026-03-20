import {assertNonEmpty} from "./common.validators";

export function assertWorkspaceNumber(workspaceNumber: string, rowNumber: number) {
    const label = "Workspace Number"

    assertNonEmpty(workspaceNumber, label, rowNumber)

    const validLengths = [3, 4];

    if (!validLengths.includes(workspaceNumber.length)) {
        throw new Error(`${label} must be exactly 3 or 4 characters long (got "${workspaceNumber}" at row ${rowNumber})`)
    }
}
