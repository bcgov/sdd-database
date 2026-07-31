import { MobilePlanFormValues, MobilePlanUpdateFormValues } from "@/types";
import {
  validateBooleanField,
  validateMobilePlanDataAllowanceField,
  validateMobilePlanPhoneNumberField,
  validateRequiredSelectionField,
} from "@/validators";
import {
  getMobilePlanServiceProviderById,
  getMobilePlanStatusById,
} from "@/db/data-access/lookups";
import { DEFAULT_MOBILE_PLAN_STATUS } from "@/domain/mobilePlans";

export async function validateMobilePlanData(mobilePlan: MobilePlanFormValues) {
  const fieldValidationError =
    validateMobilePlanPhoneNumberField(mobilePlan.phone_number) ??
    validateBooleanField(mobilePlan.enhanced_voicemail, "Enhanced Voicemail") ??
    validateRequiredSelectionField(
      mobilePlan.service_provider_id,
      "Service Provider",
    ) ??
    validateMobilePlanDataAllowanceField(mobilePlan.data_allowance_gb) ??
    validateRequiredSelectionField(mobilePlan.status_id, "Status");

  if (fieldValidationError) {
    return fieldValidationError;
  }

  const [status, serviceProvider] = await Promise.all([
    getMobilePlanStatusById(mobilePlan.status_id),
    getMobilePlanServiceProviderById(mobilePlan.service_provider_id),
  ]);

  if (!status) {
    return "The selected Status is invalid. Please reselect a status and try again.";
  }

  if (status.name !== DEFAULT_MOBILE_PLAN_STATUS) {
    return `New mobile plans must have a Status of ${DEFAULT_MOBILE_PLAN_STATUS}.`;
  }

  if (!serviceProvider) {
    return "The selected Service Provider is invalid. Please reselect a service provider and try again.";
  }
}

export async function validateMobilePlanUpdateData(
  mobilePlan: MobilePlanUpdateFormValues,
) {
  const fieldValidationError =
    validateRequiredSelectionField(mobilePlan.id, "Mobile Plan") ??
    validateBooleanField(mobilePlan.enhanced_voicemail, "Enhanced Voicemail") ??
    validateMobilePlanDataAllowanceField(mobilePlan.data_allowance_gb) ??
    validateRequiredSelectionField(mobilePlan.status_id, "Status");

  if (fieldValidationError) {
    return fieldValidationError;
  }

  const status = await getMobilePlanStatusById(mobilePlan.status_id);

  if (!status) {
    return "The selected Status is invalid. Please reselect a status and try again.";
  }
}
