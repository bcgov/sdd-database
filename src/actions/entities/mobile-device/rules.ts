import {MobileDeviceFormValues} from "@/types";
import {
    validateAdrField,
    validateGilrField,
    validateImeiField,
    validateNotesField,
    validateOfficeNumberField,
    validateOrderDateField
} from "@/validators";
import {officeExistsByOfficeNumber} from "@/db/data-access/offices";
import {getMobileDeviceModelById} from "@/db/data-access/lookups";
import {getMobilePlanAssignmentById} from "@/db/data-access/mobilePlans";
import {isMobileDeviceStatus, mobileDeviceModelRequiresImei} from "@/domain/mobileDevices";
import {DEFAULT_MOBILE_PLAN_STATUS} from "@/domain/mobilePlans";
import {validateRequiredSelectionField} from "@/validators";


export async function validateMobileDeviceData(mobileDevice: MobileDeviceFormValues) {
    const fieldValidationError =
        (mobileDevice.imei ? validateImeiField(mobileDevice.imei) : undefined) ??
        validateOrderDateField(mobileDevice.order_date) ??
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

    const mobilePlanAssignmentValidationError = await validateMobilePlanAssignment(mobileDevice)

    if (mobilePlanAssignmentValidationError) {
        return mobilePlanAssignmentValidationError
    }
}

async function validateMobilePlanAssignment(mobileDevice: MobileDeviceFormValues) {
    const mobilePlanId = mobileDevice.ui_mobile_plan_id

    if (mobilePlanId === null) return

    const selectedPlanIdValidationError = validateRequiredSelectionField(
        mobilePlanId,
        "Mobile Plan"
    )

    if (selectedPlanIdValidationError) {
        return selectedPlanIdValidationError
    }

    const mobilePlan = await getMobilePlanAssignmentById(mobilePlanId)

    if (!mobilePlan) {
        return "The selected mobile plan no longer exists. Please choose another plan."
    }

    // An already linked plan is valid only when the user is retaining the link
    // on the same mobile device. This allows historical Suspended/Cancelled
    // plans to remain visible and editable without becoming assignment choices.
    if (mobilePlan.mobile_device_id === mobileDevice.id) return

    if (mobilePlan.status.name !== DEFAULT_MOBILE_PLAN_STATUS) {
        return "Only active mobile plans can be assigned to a mobile device. Please choose another plan."
    }

    if (mobilePlan.mobile_device_id !== null) {
        return "The selected mobile plan is already assigned to another mobile device. Please choose another plan."
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
    if (!isMobileDeviceStatus(mobileDevice.ui_mobile_device_status)) {
        return "The selected mobile device status is invalid. Please reselect a status and try again."
    }

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
