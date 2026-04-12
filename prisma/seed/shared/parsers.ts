import {assertName} from "../validators/employees.validators";


function parseAssignedTo(assignedTo: string, rowNumber: number) {
    const parts = assignedTo.split(",").map(part => part.trim())

    if (parts.length !== 2) {
        throw new Error(
            `Assigned To could not be parsed into employee name fields at row ${rowNumber}. Expected a name like "Last, First". Got "${assignedTo}"`
        )
    }

    const [lastName, firstNameAndPossibleAlternateName] = parts

    if (!lastName) {
        throw new Error(
            `Assigned To is missing last name at row ${rowNumber}. Got "${assignedTo}"`
        )
    }

    if (!firstNameAndPossibleAlternateName) {
        throw new Error(
            `Assigned To is missing first name at row ${rowNumber}. Got "${assignedTo}"`
        )
    }

    const alternateNameMatch = firstNameAndPossibleAlternateName.match(/^(.+?) \((.+)\)$/)
    if (alternateNameMatch) {
        const [, firstName, alternateName] = alternateNameMatch

        return {
            firstName,
            alternateName,
            lastName,
        }
    }

    return {
        firstName: firstNameAndPossibleAlternateName,
        alternateName: null,
        lastName,
    }
}

export function parseAndAssertAssignedTo(assignedTo: string, rowNumber: number) {

    const parsedAssignedTo = parseAssignedTo(assignedTo, rowNumber)

    assertName(parsedAssignedTo.firstName, "First Name", rowNumber)

    assertName(parsedAssignedTo.lastName, "Last Name", rowNumber)

    if (parsedAssignedTo.alternateName) {
        assertName(parsedAssignedTo.alternateName, "Alternate Name", rowNumber)
    }

    return parsedAssignedTo
}
