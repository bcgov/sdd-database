function validateRequiredField(value: string | number, label: string) {
    if (!value) {   // note this will also exclude the number 0
        return `${label} is required`;
    }
}

function validateMaxLength(value: string, maxLength: number, label: string) {
    if (value.length > maxLength) {
        return `${label} cannot be longer than ${maxLength} characters`;
    }
}

function validateOnlyLettersAndNumbers(value: string, label: string) {
    if (!/^[A-Za-z0-9]*$/.test(value)) {
        return `${label} can only contain letters and numbers (no special characters)`;
    }
}

export function validateEmployeeNameField(
    value: string,
    label: string,
    {
        required = true,
        allowMultipleWords = true
    }: {
        required?: boolean;
        allowMultipleWords?: boolean;
    } = {}
) {
    if (required) {
        const requiredError = validateRequiredField(value, label)

        if (requiredError) {
            return requiredError;
        }
    }

    const multipleWordsRegex = /^$|^[A-Za-z]+(?:[-'][A-Za-z]+)*\.?(?: [A-Za-z]+(?:[-'][A-Za-z]+)*\.?)*$/;
    const singleWordRegex = /^$|^[A-Za-z]+(?:[-'][A-Za-z]+)*\.?$/;

    const pattern = allowMultipleWords ? multipleWordsRegex : singleWordRegex;

    if (!pattern.test(value)) {

        let errorMessage = `${label} can contain only alphabets, apostrophes or hyphens within words, optional periods after words`;

        if (allowMultipleWords) {
            errorMessage += ` and single spaces in between words`;
        } else {
            errorMessage += ` and must be a single word`;
        }

        return errorMessage;
    }

    const NAME_MAX_LENGTH = 30;

    const maxLengthError = validateMaxLength(value, NAME_MAX_LENGTH, label);

    if (maxLengthError) {
        return maxLengthError;
    }
}

export function validateEmployeeIdField(value: string, label: string = "Employee ID") {

    const EMPLOYEE_ID_LENGTH = 6;

    const requiredError = validateRequiredField(value, label);

    if (requiredError) {
        return requiredError;
    }

    if (value.length !== EMPLOYEE_ID_LENGTH) {
        return `${label} must be exactly ${EMPLOYEE_ID_LENGTH} digits long`;
    }

    if (/\D/.test(value)) {
        return `${label} can only contain digits (0–9)`;
    }
}

export function validateEmployeeIdirField(value: string, label: string = "IDIR") {

    const IDIR_MAX_LENGTH = 8;

    const maxLengthError = validateMaxLength(value, IDIR_MAX_LENGTH, label);

    if (maxLengthError) {
        return maxLengthError;
    }

    const invalidCharacterError= validateOnlyLettersAndNumbers(value, label);

    if (invalidCharacterError) {
        return invalidCharacterError;
    }
}

export function validateNotesField(value: string, label: string = "Notes") {
    const NOTES_MAX_LENGTH = 2000;

    const maxLengthError = validateMaxLength(value, NOTES_MAX_LENGTH, label);

    if (maxLengthError) {
        return maxLengthError;
    }
}

export function validateEmployeeOfficeNumberField(value: string, label: string = "Office Number") {
    const requiredError = validateRequiredField(value, label);

    if (requiredError) {
        return requiredError;
    }
}

export function validateEmployeeProgramAreaField(value: number, label: string = "Program Area") {
    const requiredError = validateRequiredField(value, label);

    if (requiredError) {
        return requiredError;
    }
}

export function validateAssetTagField(value: string, label: string = "Asset Tag") {
    const requiredError = validateRequiredField(value, label);

    if (requiredError) {
        return requiredError;
    }

    const invalidCharacterError= validateOnlyLettersAndNumbers(value, label);

    if (invalidCharacterError) {
        return invalidCharacterError;
    }

    const validLengths = [8, 10, 14];

    if (!validLengths.includes(value.length)) {
        return `${label} must be exactly 8, 10, or 14 characters long.`;
    }
}
