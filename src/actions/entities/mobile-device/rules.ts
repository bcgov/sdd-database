import {MobileDeviceFormValues} from "@/types";
import {validateImeiField} from "@/validators";


export async function validateMobileDeviceData(mobileDevice: MobileDeviceFormValues) {
    const fieldValidationError = validateImeiField(mobileDevice.imei)

    if (fieldValidationError) {
        return fieldValidationError
    }
}
