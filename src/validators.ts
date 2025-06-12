function validateRequiredField(value: string, label: string) {
    if (!value) {
        return `${label} is required`;
    }
}

function validateMaxLength(value: string, maxLength: number, label: string) {
    if (value.length > maxLength) {
        return `${label} cannot be longer than ${maxLength} characters`;
    }
}

export function validateEmployeeNameField(value: string, label: string, required: boolean = true) {
    const NAME_MAX_LENGTH = 30;

    if (required) {
        const requiredError = validateRequiredField(value, label)

        if (requiredError) {
            return requiredError;
        }
    }

    if (/\s/.test(value)) {
        return `${label} must be a single word (no spaces)`;
    }

    const maxLengthError = validateMaxLength(value, NAME_MAX_LENGTH, label);

    if (maxLengthError) {
        return maxLengthError;
    }

    if (!/^[A-Za-z]*$/.test(value)) {
        return `${label} can contain only alphabets`;
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

    const requiredError = validateRequiredField(value, label);

    if (requiredError) {
        return requiredError;
    }

    const maxLengthError = validateMaxLength(value, IDIR_MAX_LENGTH, label);

    if (maxLengthError) {
        return maxLengthError;
    }

    if (!/^[A-Za-z0-9]+$/.test(value)) {
        return `${label} can only contain letters and numbers (no special characters)`;
    }
}

export function validateEmployeeNotesField(value: string, label: string = "Notes") {
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
