import {MobilePlanFormValues} from "@/types";
import {
    validateMobilePlanDataAllowanceField,
    validateMobilePlanPhoneNumberField,
    validateRequiredSelectionField
} from "@/validators";
import {
    getMobilePlanServiceProviderById,
    getMobilePlanStatusById
} from "@/db/data-access/lookups";


export async function validateMobilePlanData(mobilePlan: MobilePlanFormValues) {
    const fieldValidationError =
        validateMobilePlanPhoneNumberField(mobilePlan.phone_number) ??
        validateRequiredSelectionField(
            mobilePlan.service_provider_id,
            "Service Provider"
        ) ??
        validateMobilePlanDataAllowanceField(mobilePlan.data_allowance_gb) ??
        validateRequiredSelectionField(
            mobilePlan.status_id,
            "Status"
        )

    if (fieldValidationError) {
        return fieldValidationError
    }

    const [status, serviceProvider] = await Promise.all([
        getMobilePlanStatusById(mobilePlan.status_id),
        getMobilePlanServiceProviderById(mobilePlan.service_provider_id)
    ])

    if (!status) {
        return "The selected Status is invalid. Please reselect a status and try again."
    }

    if (!serviceProvider) {
        return "The selected Service Provider is invalid. Please reselect a service provider and try again."
    }
}
