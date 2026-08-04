import type { MobileDeviceLike } from "@/components/EntityForms/MobileDevice/types";
import { getMobilePlanTitle } from "@/domain/mobilePlans";

type MobileDevicePlanAssignmentState = {
  hasMobilePlanAssignment: boolean;
  mobilePlanId: number | null;
  mobilePlanTitle: string;
};

/**
 * A form snapshot takes precedence over hydrated relationship data. In
 * particular, a draft `null` means the user intentionally removed the plan;
 * falling back to `mobile_plan` in that case would redraw the old assignment.
 */
export function getMobileDevicePlanAssignmentState(
  mobileDevice: MobileDeviceLike,
): MobileDevicePlanAssignmentState {
  const hasDraftPlanSelection =
    mobileDevice !== undefined &&
    "ui_mobile_plan_id" in mobileDevice &&
    mobileDevice.ui_mobile_plan_id !== undefined;

  if (hasDraftPlanSelection) {
    const mobilePlanId = mobileDevice.ui_mobile_plan_id ?? null;

    return {
      hasMobilePlanAssignment: mobilePlanId !== null,
      mobilePlanId,
      mobilePlanTitle:
        mobilePlanId === null
          ? "Unassigned"
          : mobileDevice.ui_mobile_plan_title || "Unassigned",
    };
  }

  const hydratedMobilePlan =
    mobileDevice && "mobile_plan" in mobileDevice
      ? mobileDevice.mobile_plan
      : null;

  return {
    hasMobilePlanAssignment: hydratedMobilePlan !== null,
    mobilePlanId: hydratedMobilePlan?.id ?? null,
    mobilePlanTitle: hydratedMobilePlan
      ? getMobilePlanTitle(hydratedMobilePlan)
      : "Unassigned",
  };
}
