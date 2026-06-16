function validateRequiredField(value: string | number | null | undefined, label: string) {
    if (value == null || value == "") {
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

function validateOnlyDigits(value: string, label: string) {
    if (/\D/.test(value)) {
        return `${label} can only contain digits (0–9)`;
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

    if (!value) {
        return;
    }

    if (value.length !== EMPLOYEE_ID_LENGTH) {
        return `${label} must be exactly ${EMPLOYEE_ID_LENGTH} digits long`;
    }

    const invalidCharacterError = validateOnlyDigits(value, label)
    if (invalidCharacterError) {
        return invalidCharacterError
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
    const NOTES_MAX_LENGTH = 200;

    const maxLengthError = validateMaxLength(value, NOTES_MAX_LENGTH, label);

    if (maxLengthError) {
        return maxLengthError;
    }
}

export function validateOfficeNumberField(value: string, label: string = "Office Number") {
    const requiredError = validateRequiredField(value, label);
    if (requiredError) {
        return requiredError;
    }

    const OFFICE_NUMBER_MAX_LENGTH = 3
    const maxLengthError = validateMaxLength(value, OFFICE_NUMBER_MAX_LENGTH, label);
    if (maxLengthError) {
        return maxLengthError;
    }

    const invalidCharacterError = validateOnlyDigits(value, label)
    if (invalidCharacterError) {
        return invalidCharacterError
    }
}

export function validateEmployeeProgramAreaField(value: number, label: string = "Program Area") {
    const requiredError = validateRequiredField(value, label)

    if (requiredError) {
        return requiredError
    }
}

export function validateEmployeeJobTitleField(value: number | null, label: string = "Job Title") {
    const requiredError = validateRequiredField(value, label)

    if (requiredError) {
        return requiredError
    }
}

export function validateAssetTagField(value: string, label: string = "Asset Tag") {
    const requiredError = validateRequiredField(value, label);
    if (requiredError) {
        return requiredError;
    }

    const invalidCharacterError = validateOnlyLettersAndNumbers(value, label);
    if (invalidCharacterError) {
        return invalidCharacterError;
    }
}

export function validateImeiField(value: string, label: string = "IMEI") {
    const IMEI_LENGTH = 15
    if (value.length !== IMEI_LENGTH) {
        return `${label} must be exactly ${IMEI_LENGTH} digits long`
    }

    const invalidCharacterError = validateOnlyDigits(value, label)
    if (invalidCharacterError) {
        return invalidCharacterError
    }
}

export function validateAdrField(value: string, label: string = "ADR Number") {
    const ADR_LENGTH = 18

    if (!value) {
        return;
    }

    if (value.length !== ADR_LENGTH) {
        return `${label} must be exactly ${ADR_LENGTH} characters long`;
    }

    if (!/^\d{7}-\d{10}$/.test(value)) {
        return `${label} must use format #######-########## i.e. ADR reference (7 digits), hyphen, followed by 10-digit legacy phone number`
    }
}

export function validateGilrField(value: string, label: string = "GILR Number ") {
    const GILR_LENGTH = 25

    if (!value) {
        return;
    }

    if (value.length !== GILR_LENGTH) {
        return `${label} must be exactly ${GILR_LENGTH} characters long`;
    }

    if (!/^\d{4}-C\d{2}-\d{5}-\d{10}$/.test(value)) {
        return `${label} must use format ####-C##-#####-########## i.e. GILR reference (14 characters), hyphen, followed by 10-digit legacy phone number`
    }
}
