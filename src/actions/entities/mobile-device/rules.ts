import {MobileDeviceFormValues} from "@/types";
import {validateImeiField, validateNotesField} from "@/validators";


export async function validateMobileDeviceData(mobileDevice: MobileDeviceFormValues) {
    const fieldValidationError = validateImeiField(mobileDevice.imei) ??
        (mobileDevice.notes ? validateNotesField(mobileDevice.notes) : undefined)

    if (fieldValidationError) {
        return fieldValidationError
    }
}
