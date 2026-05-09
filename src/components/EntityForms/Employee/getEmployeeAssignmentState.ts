import {EmployeeLike} from "@/components/EntityForms/Employee/types";


type EmployeeAssignmentState = {
    hasOfficeAssignment: boolean
    officeNumber: string

    hasWorkspaceAssignment: boolean
    workspaceNumber: string
    selectedWorkspaceRestrictedProgramAreaId: number | null | undefined

    workstationAssetTags: string[]

    hasMobileDeviceAssignment: boolean
    mobileDeviceId: number | undefined
    mobileDeviceTitle: string
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
    const workspace = employee && "workspace" in employee
        ? employee.workspace
        : null

    const uiWorkspaceNumber = employee && "ui_workspace_number" in employee
        ? employee.ui_workspace_number
        : undefined

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

    /**
     * Mobile Device
     */
    const mobileDevice = employee && "mobile_device" in employee
        ? employee.mobile_device
        : null

    // id
    const uiMobileDeviceId = employee && "ui_mobile_device_id" in employee
        ? employee.ui_mobile_device_id
        : undefined

    const mobileDeviceId = uiMobileDeviceId ?? mobileDevice?.id

    const hasMobileDeviceAssignment = mobileDeviceId !== undefined

    // title
    const uiMobileDeviceTitle = employee && "ui_mobile_device_title" in employee
        ? employee.ui_mobile_device_title
        : undefined

    let hydratedMobileDeviceTitle: string | undefined

    if (mobileDevice) {
        const modelName = mobileDevice.mobile_device_model.name

        hydratedMobileDeviceTitle = mobileDevice.imei
            ? `${modelName} - ${mobileDevice.imei}`
            : modelName
    }

    const mobileDeviceTitle =
        uiMobileDeviceTitle ??
        hydratedMobileDeviceTitle ??
        "Unassigned"

    return {
        hasOfficeAssignment,
        officeNumber,

        hasWorkspaceAssignment,
        workspaceNumber,
        selectedWorkspaceRestrictedProgramAreaId,

        workstationAssetTags,

        hasMobileDeviceAssignment,
        mobileDeviceId,
        mobileDeviceTitle
    }
}
