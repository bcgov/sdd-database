import type { Prisma, Office } from "@/generated/prisma/client";
import {
  employeeSearchResultArgs,
  mobileDeviceSearchResultArgs,
  mobilePlanSearchResultArgs,
  workspaceSearchResultArgs,
  workstationSearchResultArgs,
} from "@/db/data-access/searchResultArgs";

// Using type-only import to prevent circular dependency
import type { MobileDeviceStatus } from "@/domain/mobileDevices";

/**
 * Employee Types
 */
type EmployeePersistedFields = {
  idir: string | null;
  first_name: string;
  alternate_name: string | null;
  last_name: string;
  employee_id: string | null;
  is_on_leave: boolean;
  notes: string | null;
  office_number: string;
  program_area_id: number;
  job_title_id: number | null;
  workspace_assignment_type_id: number | null;
};

type EmployeeUIAssignmentFields = {
  // UI-only branch cache so branch prefill survives modal close/open
  ui_branch_id?: number;

  // UI-only workspace state
  ui_workspace_number?: string;
  ui_workspace_restricted_program_area_id?: number | null;

  // UI-only workstation state
  ui_workstation_asset_tags?: string[];

  // ui_only mobile device state
  ui_mobile_device_id?: number;
  ui_mobile_device_title?: string;
};

type EmployeeFormExtraFields = EmployeeUIAssignmentFields & {
  id?: number;
  ohs_accommodation_type_ids: number[];
};

export type EmployeeFormValues = EmployeePersistedFields &
  EmployeeFormExtraFields;

// employee returned from DB search results with hydrated program area, workspace and ohs accommodations
export type EmployeeSearchResult = Prisma.EmployeeGetPayload<
  typeof employeeSearchResultArgs
>;

type EmployeeEntityFields = EmployeeSearchResult & EmployeeUIAssignmentFields;

export type EmployeeEntity = EmployeeEntityFields & {
  type: "employee";
};

/**
 * Office Types
 */
export type OfficeEntity = Office & {
  type: "office";
};

/**
 * Workspace Types
 */
export type WorkspaceSearchResult = Prisma.WorkspaceGetPayload<
  typeof workspaceSearchResultArgs
>;

export type WorkspaceEntity = WorkspaceSearchResult & {
  type: "workspace";
};

export type WorkspaceFormValues = {
  office_number: string;
  workspace_number: string;
  is_on_hold: boolean;
  position_number: string | null;
  notes?: string;
};

/**
 * Workstation Types
 */

export type WorkstationFormValues = {
  asset_tag: string;
  model_id: number;
  office_number: string;
  notes: string | null;
};

export type WorkstationSearchResult = Prisma.WorkstationGetPayload<
  typeof workstationSearchResultArgs
>;

export type WorkstationEntity = WorkstationSearchResult & {
  type: "workstation";
};

/**
 * Mobile Device Types
 */

type MobileDevicePersistedFields = {
  imei: string | null;
  order_date: Date;
  adr: string | null;
  gilr: string | null;
  notes: string | null;
  model_id: number;
  office_number: string;
};

type MobileDeviceStatusUIFields = {
  // UI-only status submitted by the form for conditional validation
  ui_mobile_device_status: MobileDeviceStatus;
};

type MobileDevicePlanAssignmentUIFields = {
  // `null` deliberately means that the user removed the plan. This is distinct
  // from an entity that has not yet been given a UI draft value.
  ui_mobile_plan_id: number | null;
  ui_mobile_plan_title: string;
};

type MobileDeviceFormExtraFields = MobileDeviceStatusUIFields &
  MobileDevicePlanAssignmentUIFields & {
    id?: number;
  };

export type MobileDeviceFormValues = MobileDevicePersistedFields &
  MobileDeviceFormExtraFields;

export type MobileDeviceSearchResult = Prisma.MobileDeviceGetPayload<
  typeof mobileDeviceSearchResultArgs
>;

export type MobileDeviceEntity = MobileDeviceSearchResult &
  Partial<MobileDevicePlanAssignmentUIFields> & {
    type: "mobileDevice";
  };

/**
 * Mobile Plan Types
 */

export type MobilePlanFormValues = {
  phone_number: string;
  data_allowance_gb: number;
  enhanced_voicemail: boolean;
  status_id: number;
  service_provider_id: number;
};

export type MobilePlanUpdateFormValues = Pick<
  MobilePlanFormValues,
  "data_allowance_gb" | "enhanced_voicemail" | "status_id"
> & {
  id: number;
};

export type MobilePlanSearchResult = Prisma.MobilePlanGetPayload<
  typeof mobilePlanSearchResultArgs
>;

export type MobilePlanEntity = MobilePlanSearchResult & {
  type: "mobilePlan";
};

/**
 * Common Types
 */

export type LookupOption = {
  id: number;
  name: string;
};

export type AssignMode =
  | "none"
  | "office"
  | "workspace"
  | "workstation"
  | "mobileDevice"
  | "mobilePlan";

export type SelectedWorkspaceAssignment = {
  workspace_number: string;
  restricted_program_area_id: number | null;
};

// discriminated union
export type Entity =
  | EmployeeEntity
  | OfficeEntity
  | WorkspaceEntity
  | WorkstationEntity
  | MobileDeviceEntity
  | MobilePlanEntity;

export type EntityType = Entity["type"];

export type EntityActionResult =
  | { status: "idle" } // before the first submit i.e. initial state
  | { status: "ok" } // server-side validation passed and entity action is successful
  | { status: "error"; error: string }; // server-side validation failed or an error occurred while processing the action

export type SearchOptions = {
  modeOverride?: AssignMode;
  employeeOfficeNumber?: string;
  employeeProgramAreaId?: number;
  employeeWorkstationAssetTags?: string[];
};

export type EmployeeAdvancedSearchFilters = {
  firstName?: string;
  alternateName?: string;
  lastName?: string;
  idir?: string;
  employeeId?: string;
  notes?: string;
  officeNumber?: string;
  branchId?: number;
  programAreaId?: number;
  jobTitleId?: number;
  isOnLeave?: boolean;
  workspaceAssignmentTypeId?: number;
  ohsAccommodationTypeIds?: number[];
  workspaceNumber?: string;
  workstationAssetTag?: string;
  mobileDeviceImei?: string;
};

export type EmployeeAdvancedSearchRequest = {
  entityType: "employee";
  query?: string;
  filters: EmployeeAdvancedSearchFilters;
};

export type OfficeAdvancedSearchFilters = {
  officeNumber?: string;
  officeName?: string;
  officeTypeId?: number;
  clientServiceTypeId?: number;
  address?: string;
  city?: string;
  postalCode?: string;
};

export type OfficeAdvancedSearchRequest = {
  entityType: "office";
  query?: string;
  filters: OfficeAdvancedSearchFilters;
};

export type WorkspaceAdvancedSearchStatus = "available" | "onHold" | "occupied";

export type WorkspaceAdvancedSearchFilters = {
  officeNumber?: string;
  workspaceNumber?: string;
  positionNumber?: string;
  categoryId?: number;
  deskTypeId?: number;
  officeFloor?: number;
  notes?: string;
  status?: WorkspaceAdvancedSearchStatus;
  restrictedBranchId?: number;
  restrictedProgramAreaId?: number | null;
  assignedEmployeeIdir?: string;
};

export type WorkspaceAdvancedSearchRequest = {
  entityType: "workspace";
  query?: string;
  filters: WorkspaceAdvancedSearchFilters;
};

export type WorkstationAdvancedSearchFilters = {
  assetTag?: string;
  modelId?: number;
  officeNumber?: string;
  notes?: string;
  isAssigned?: boolean;
  assignedEmployeeIdir?: string;
};

export type WorkstationAdvancedSearchRequest = {
  entityType: "workstation";
  query?: string;
  filters: WorkstationAdvancedSearchFilters;
};

export type MobileDeviceAdvancedSearchStatus =
  | "unassigned"
  | "assigned"
  | "adr"
  | "gilr";

export type MobileDeviceAdvancedSearchFilters = {
  imei?: string;
  orderDate?: string;
  paymentEndDate?: string;
  adr?: string;
  gilr?: string;
  notes?: string;
  modelId?: number;
  officeNumber?: string;
  status?: MobileDeviceAdvancedSearchStatus;
  isAssigned?: boolean;
  assignedEmployeeIdir?: string;
  hasMobilePlan?: boolean;
  mobilePlanPhoneNumber?: string;
};

export type MobileDeviceAdvancedSearchRequest = {
  entityType: "mobileDevice";
  query?: string;
  filters: MobileDeviceAdvancedSearchFilters;
};

export type MobilePlanAdvancedSearchFilters = {
  phoneNumber?: string;
  dataAllowanceGb?: number;
  enhancedVoicemail?: boolean;
  statusId?: number;
  serviceProviderId?: number;
  isAssigned?: boolean;
  assignedMobileDeviceImei?: string;
};

export type MobilePlanAdvancedSearchRequest = {
  entityType: "mobilePlan";
  query?: string;
  filters: MobilePlanAdvancedSearchFilters;
};

export type AdvancedSearchRequest =
  | EmployeeAdvancedSearchRequest
  | OfficeAdvancedSearchRequest
  | WorkspaceAdvancedSearchRequest
  | WorkstationAdvancedSearchRequest
  | MobileDeviceAdvancedSearchRequest
  | MobilePlanAdvancedSearchRequest;
