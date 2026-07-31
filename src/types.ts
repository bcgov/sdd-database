import type {Prisma, Office} from "@/generated/prisma/client";
import {
    employeeSearchResultArgs,
    mobileDeviceSearchResultArgs, mobilePlanSearchResultArgs,
    workspaceSearchResultArgs,
    workstationSearchResultArgs
} from "@/db/data-access/searchResultArgs";

// Using type-only import to prevent circular dependency
import type {MobileDeviceStatus} from "@/domain/mobileDevices";


/**
 * Employee Types
 */
type EmployeePersistedFields = {
    idir: string | null
    first_name: string
    alternate_name: string | null
    last_name: string
    employee_id: string | null
    is_on_leave: boolean
    notes: string | null
    office_number: string
    program_area_id: number
    job_title_id: number | null
    workspace_assignment_type_id: number | null
}

type EmployeeUIAssignmentFields = {
    // UI-only branch cache so branch prefill survives modal close/open
    ui_branch_id?: number

    // UI-only workspace state
    ui_workspace_number?: string
    ui_workspace_restricted_program_area_id?: number | null

    // UI-only workstation state
    ui_workstation_asset_tags?: string[]

    // ui_only mobile device state
    ui_mobile_device_id?: number
    ui_mobile_device_title?: string
}

type EmployeeFormExtraFields = EmployeeUIAssignmentFields & {
    id?: number
    ohs_accommodation_type_ids: number[]
}

export type EmployeeFormValues = EmployeePersistedFields & EmployeeFormExtraFields

// employee returned from DB search results with hydrated program area, workspace and ohs accommodations
export type EmployeeSearchResult = Prisma.EmployeeGetPayload<typeof employeeSearchResultArgs>

type EmployeeEntityFields = EmployeeSearchResult & EmployeeUIAssignmentFields

export type EmployeeEntity = EmployeeEntityFields & {
    type: "employee"
}

/**
 * Office Types
 */
export type OfficeEntity = Office & {
    type: "office"
}

/**
 * Workspace Types
 */
export type WorkspaceSearchResult = Prisma.WorkspaceGetPayload<typeof workspaceSearchResultArgs>

export type WorkspaceEntity = WorkspaceSearchResult & {
    type: "workspace"
}

/**
 * Workstation Types
 */

export type WorkstationFormValues = {
    asset_tag: string
    model_id: number
    office_number: string
    notes: string | null
}

export type WorkstationSearchResult = Prisma.WorkstationGetPayload<typeof workstationSearchResultArgs>

export type WorkstationEntity = WorkstationSearchResult & {
    type: "workstation"
}

/**
 * Mobile Device Types
 */

type MobileDevicePersistedFields = {
    imei: string | null
    order_date: Date
    adr: string | null
    gilr: string | null
    notes: string | null
    model_id: number
    office_number: string
}

type MobileDeviceUIFields = {
    // UI-only status submitted by the form for conditional validation
    ui_mobile_device_status: MobileDeviceStatus
}

type MobileDeviceFormExtraFields = MobileDeviceUIFields & {
    id?: number
}

export type MobileDeviceFormValues = MobileDevicePersistedFields & MobileDeviceFormExtraFields

export type MobileDeviceSearchResult = Prisma.MobileDeviceGetPayload<typeof mobileDeviceSearchResultArgs>

export type MobileDeviceEntity = MobileDeviceSearchResult & {
    type: "mobileDevice"
}

/**
 * Mobile Plan Types
 */

export type MobilePlanFormValues = {
    phone_number: string
    data_allowance_gb: number
    status_id: number
    service_provider_id: number
}

export type MobilePlanSearchResult = Prisma.MobilePlanGetPayload<typeof mobilePlanSearchResultArgs>

export type MobilePlanEntity = MobilePlanSearchResult & {
    type: "mobilePlan"
}

/**
 * Common Types
 */

export type LookupOption = {
    id: number;
    name: string;
}

export type AssignMode =
    | "none"
    | "office"
    | "workspace"
    | "workstation"
    | "mobileDevice"

export type SelectedWorkspaceAssignment = {
    workspace_number: string
    restricted_program_area_id: number | null
}

// discriminated union
export type Entity =
    | EmployeeEntity
    | OfficeEntity
    | WorkspaceEntity
    | WorkstationEntity
    | MobileDeviceEntity
    | MobilePlanEntity

export type EntityType = Entity["type"]

export type EntityActionResult =
    | { status: "idle" }                    // before the first submit i.e. initial state
    | { status: "ok" }                      // server-side validation passed and entity action is successful
    | { status: "error"; error: string };   // server-side validation failed or an error occurred while processing the action

export type SearchOptions = {
    modeOverride?: AssignMode
    employeeOfficeNumber?: string
    employeeProgramAreaId?: number
    employeeWorkstationAssetTags?: string[]
}
