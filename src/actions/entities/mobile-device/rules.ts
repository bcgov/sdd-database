import {MobileDeviceFormValues} from "@/types";
import {validateImeiField, validateNotesField, validateOfficeNumberField} from "@/validators";
import {officeExistsByOfficeNumber} from "@/db/data-access/offices";
import {getMobileDeviceModelById} from "@/db/data-access/lookups";
import {mobileDeviceModelRequiresImei} from "@/domain/mobileDevices";


export async function validateMobileDeviceData(mobileDevice: MobileDeviceFormValues) {
    const fieldValidationError =
        (mobileDevice.imei ? validateImeiField(mobileDevice.imei) : undefined) ??
        (mobileDevice.notes ? validateNotesField(mobileDevice.notes) : undefined) ??
        validateOfficeNumberField(mobileDevice.office_number)

    if (fieldValidationError) {
        return fieldValidationError
    }

    const mobileDeviceModel = await getMobileDeviceModelById(mobileDevice.model_id)
    if (!mobileDeviceModel) {
        return `The selected mobile device model is invalid. Please reselect a model and try again.`
    }

    const imeiRuleValidationError = validateImeiRulesForMobileDeviceModel(
        mobileDevice.imei,
        mobileDeviceModel.name
    )

    if (imeiRuleValidationError) {
        return imeiRuleValidationError
    }

    const officeExists = await officeExistsByOfficeNumber(mobileDevice.office_number)
    if (!officeExists) {
        return `Office number ${mobileDevice.office_number} does not exist. Please enter a valid office number.`
    }
}

function validateImeiRulesForMobileDeviceModel(
    imei: string | null,
    modelName: string
) {
    const requiresImei = mobileDeviceModelRequiresImei(modelName)

    if (requiresImei && !imei) return `IMEI is required for ${modelName}`
    if (!requiresImei && imei) return `IMEI should be blank for ${modelName}`
}
