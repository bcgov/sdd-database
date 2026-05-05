import {MobileDeviceFormValues} from "@/types";
import {validateImeiField, validateNotesField, validateOfficeNumberField} from "@/validators";
import {officeExistsByOfficeNumber} from "@/db/data-access/offices";


export async function validateMobileDeviceData(mobileDevice: MobileDeviceFormValues) {
    const fieldValidationError = validateImeiField(mobileDevice.imei) ??
        (mobileDevice.notes ? validateNotesField(mobileDevice.notes) : undefined) ??
        validateOfficeNumberField(mobileDevice.office_number)

    if (fieldValidationError) {
        return fieldValidationError
    }

    const officeExists = await officeExistsByOfficeNumber(mobileDevice.office_number)
    if (!officeExists) {
        return `Office number ${mobileDevice.office_number} does not exist. Please enter a valid office number.`
    }
}
