import type {Prisma, Office} from "@/generated/prisma/client";
import {
    employeeSearchResultArgs,
    workspaceSearchResultArgs,
    workstationSearchResultArgs
} from "@/db/data-access/shared";


export type LookupOption = {
    id: number;
    name: string;
};

export type SelectedWorkspaceAssignment = {
    workspace_number: string
    restricted_program_area_id: number | null
}

type EmployeePersistedFields = {
    office_number: string;
    idir: string | null;
    first_name: string;
    alternate_name: string | null;
    last_name: string;
    employee_id: string | null;
    program_area_id: number;
    job_title_id: number | null;
    notes: string | null;
}

type EmployeeFormExtraFields = {
    id?: number;

    // UI-only branch cache so branch prefill survives modal close/open
    ui_branch_id?: number;

    // UI-only workspace state
    ui_workspace_number?: string;
    ui_workspace_restricted_program_area_id?: number | null;

    // UI-only workstation state
    ui_workstation_asset_tags?: string[]

    ohs_accommodation_type_ids: number[];
}

export type EmployeeFormValues = EmployeePersistedFields & EmployeeFormExtraFields

// employee returned from DB search results with hydrated program area, workspace and ohs accommodations
export type EmployeeSearchResult = Prisma.EmployeeGetPayload<typeof employeeSearchResultArgs>

export type WorkspaceSearchResult = Prisma.WorkspaceGetPayload<typeof workspaceSearchResultArgs>

export type WorkstationSearchResult = Prisma.WorkstationGetPayload<typeof workstationSearchResultArgs>

type EmployeeEntity = EmployeeSearchResult & {
    ui_branch_id?: number;
    ui_workspace_number?: string;
    ui_workspace_restricted_program_area_id?: number | null;
    ui_workstation_asset_tags?: string[]
};

// discriminated union
export type Entity =
    | (EmployeeEntity & { type: "employee" })
    | (Office & { type: "office" })
    | (WorkspaceSearchResult & { type: "workspace" })
    | (WorkstationSearchResult & { type: "workstation" })

export type EntityActionResult =
    | { status: "idle" }                    // before the first submit i.e. initial state
    | { status: "ok" }                      // server-side validation passed and entity action is successful
    | { status: "error"; error: string };   // server-side validation failed or an error occurred while processing the action

export type AssignMode = "none" | "office" | "workspace" | "workstation"

export type SearchOptions = {
    modeOverride?: AssignMode
    employeeOfficeNumber?: string
    employeeProgramAreaId?: number
    employeeWorkstationAssetTags?: string[]
}
