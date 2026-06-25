import {MobileDeviceFormValues} from "@/types";
import {
    validateAdrField,
    validateGilrField,
    validateImeiField,
    validateNotesField,
    validateOfficeNumberField
} from "@/validators";
import {officeExistsByOfficeNumber} from "@/db/data-access/offices";
import {getMobileDeviceModelById} from "@/db/data-access/lookups";
import {mobileDeviceModelRequiresImei} from "@/domain/mobileDevices";


export async function validateMobileDeviceData(mobileDevice: MobileDeviceFormValues) {
    const fieldValidationError =
        (mobileDevice.imei ? validateImeiField(mobileDevice.imei) : undefined) ??
        (mobileDevice.adr ? validateAdrField(mobileDevice.adr) : undefined) ??
        (mobileDevice.gilr ? validateGilrField(mobileDevice.gilr) : undefined) ??
        (mobileDevice.notes ? validateNotesField(mobileDevice.notes) : undefined) ??
        validateOfficeNumberField(mobileDevice.office_number)

    if (fieldValidationError) {
        return fieldValidationError
    }

    const mobileDeviceStatusValidationError = validateMobileDeviceStatusRules(mobileDevice)

    if (mobileDeviceStatusValidationError) {
        return mobileDeviceStatusValidationError
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

function validateMobileDeviceStatusRules(mobileDevice: MobileDeviceFormValues) {
    if (mobileDevice.ui_mobile_device_status === "adr" && !mobileDevice.adr) {
        return "ADR Number is required when mobile device status is Disposed"
    }

    if (mobileDevice.ui_mobile_device_status === "gilr" && !mobileDevice.gilr) {
        return "GILR Number is required when mobile device status is Lost / Stolen"
    }

    if (mobileDevice.adr && mobileDevice.gilr) {
        return "A mobile device cannot have both ADR and GILR number at the same time"
    }

    if (mobileDevice.ui_mobile_device_status === "unassigned" && (mobileDevice.adr || mobileDevice.gilr)) {
        return "Unassigned mobile devices cannot have ADR or GILR numbers"
    }

    if (mobileDevice.ui_mobile_device_status === "assigned" && (mobileDevice.adr || mobileDevice.gilr)) {
        return "Assigned mobile devices cannot have ADR or GILR numbers"
    }
}
