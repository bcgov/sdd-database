import type { EntityType } from "@/types";

export type AdvancedSearchTab = {
  entityType: EntityType;
  label: string;
  isDisabled: boolean;
};

export const advancedSearchTabs: AdvancedSearchTab[] = [
  { entityType: "employee", label: "Employee", isDisabled: false },
  { entityType: "office", label: "Office", isDisabled: false },
  { entityType: "workspace", label: "Workspace", isDisabled: false },
  { entityType: "workstation", label: "Workstation", isDisabled: false },
  { entityType: "mobileDevice", label: "Mobile Device", isDisabled: false },
  { entityType: "mobilePlan", label: "Mobile Plan", isDisabled: false },
];
