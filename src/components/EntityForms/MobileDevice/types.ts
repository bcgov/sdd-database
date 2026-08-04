import type { MobileDeviceEntity, MobileDeviceFormValues } from "@/types";

/**
 * A Mobile Device form can render either a hydrated database entity or an
 * unsaved form snapshot retained while the user is choosing a mobile plan.
 */
export type MobileDeviceLike =
  | MobileDeviceEntity
  | MobileDeviceFormValues
  | undefined;
