import {EmployeeLike} from "@/components/EntityForms/Employee/types";


type EmployeeAssignmentState = {
    hasOfficeAssignment: boolean
    officeNumber: string

    hasWorkspaceAssignment: boolean
    workspaceNumber: string
    selectedWorkspaceRestrictedProgramAreaId: number | null | undefined

    workstationAssetTags: string[]
}

export function getEmployeeAssignmentState(
    employee: EmployeeLike
): EmployeeAssignmentState {
    /**
     * Office
     */
    const hasOfficeAssignment = !!employee?.office_number

    const officeNumber = employee?.office_number ?? "Unassigned"

    /**
     * Workspace
     */
    const uiWorkspaceNumber = employee && "ui_workspace_number" in employee
        ? employee.ui_workspace_number
        : undefined

    const workspace = employee && "workspace" in employee
        ? employee.workspace
        : null

    const workspaceNumber = uiWorkspaceNumber ?? workspace?.workspace_number ?? "Unassigned"

    const hasWorkspaceAssignment = !!(uiWorkspaceNumber || workspace?.workspace_number)

    const selectedWorkspaceRestrictedProgramAreaId =
        employee && "ui_workspace_restricted_program_area_id" in employee
            ? employee.ui_workspace_restricted_program_area_id
            : workspace?.restricted_program_area_id

    /**
     * Workstation
     */
    const uiWorkstationAssetTags = employee && "ui_workstation_asset_tags" in employee
        ? employee.ui_workstation_asset_tags
        : undefined

    const workstations = employee && "workstations" in employee
        ? employee.workstations
        : []

    const workstationAssetTags = uiWorkstationAssetTags ?? workstations.map(workstation => workstation.asset_tag)

    return {
        hasOfficeAssignment,
        officeNumber,

        hasWorkspaceAssignment,
        workspaceNumber,
        selectedWorkspaceRestrictedProgramAreaId,

        workstationAssetTags
    }
}
