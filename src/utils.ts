import {EmployeeFormValues, EntityType, MobileDeviceFormValues, WorkstationFormValues} from "@/types";


export const ENTITY_TYPE_NAME: Record<EntityType, string> = {
    employee: "Employee",
    office: "Office",
    workspace: "Workspace",
    workstation: "Workstation",
    mobileDevice: "Mobile Device"
} as const;

export const parseEmployeeFormData = (formData: FormData): EmployeeFormValues => {

    // idir
    const rawIdir = formData.get("idir") as string
    const idir = rawIdir ? rawIdir.toUpperCase() : null  // normalizing to maintain consistency in the DB

    // first_name
    const firstName = formData.get("firstName") as string

    // alternate_name
    const rawAlternateName = formData.get("alternateName") as string
    const alternateName = rawAlternateName || null

    // last_name
    const lastName = formData.get("lastName") as string

    // employee_id
    const rawEmployeeId = formData.get("employeeId") as string
    const employeeId = rawEmployeeId || null

    // is_on_leave
    // Switch submits "on" when selected and nothing/null when not selected.
    const rawIsOnLeave = formData.get("isOnLeave")
    const isOnLeave = rawIsOnLeave === "on"

    // notes
    const rawNotes = formData.get("notes") as string
    const notes = rawNotes || null

    // office_number
    const rawOfficeNumber = formData.get("officeNumber") as string
    const officeNumber = rawOfficeNumber !== "Unassigned" ? rawOfficeNumber : ""

    // program_area_id
    const rawProgramAreaId = formData.get("programArea")
    const programAreaId = Number(rawProgramAreaId)

    // job_title_id
    const rawJobTitleId = formData.get("jobTitle")
    const jobTitleId = rawJobTitleId ? Number(rawJobTitleId) : null

    // workspace_assignment_type_id
    const rawWorkspaceAssignmentTypeId = formData.get("workspaceAssignmentType") as string
    const workspaceAssignmentTypeId = rawWorkspaceAssignmentTypeId
        ? Number(rawWorkspaceAssignmentTypeId)
        : null

    // id
    const rawId = formData.get("id")
    const id = rawId ? Number(rawId) : undefined

    // ui_branch_id
    const rawUIBranchId = formData.get("branch")
    const uiBranchId = rawUIBranchId ? Number(rawUIBranchId) : undefined

    // ui_workspace_number
    const rawUIWorkspaceNumber = formData.get("workspaceNumber")
    const uiWorkspaceNumber = rawUIWorkspaceNumber && rawUIWorkspaceNumber !== "Unassigned"
        ? String(rawUIWorkspaceNumber)
        : undefined

    // ui_workstation_asset_tags
    const rawUIWorkstationAssetTags = formData.getAll("workstationAssetTags")
    const uiWorkstationAssetTags = rawUIWorkstationAssetTags.map(value => String(value))

    // ui_mobile_device_id
    const rawUIMobileDeviceId = formData.get("mobileDeviceId")
    const uiMobileDeviceId = rawUIMobileDeviceId ? Number(rawUIMobileDeviceId) : undefined

    // ohs_accommodation_type_ids
    const rawOhsAccommodationTypeIds = formData.getAll("ohsAccommodationTypeIds")
    const ohsAccommodationTypeIds = rawOhsAccommodationTypeIds.map(value => Number(value))

    return {
        idir,
        first_name: firstName,
        alternate_name: alternateName,
        last_name: lastName,
        employee_id: employeeId,
        is_on_leave: isOnLeave,
        notes,
        office_number: officeNumber,
        program_area_id: programAreaId,
        job_title_id: jobTitleId,
        workspace_assignment_type_id: workspaceAssignmentTypeId,

        id,
        ui_branch_id: uiBranchId,
        ui_workspace_number: uiWorkspaceNumber,
        ui_workstation_asset_tags: uiWorkstationAssetTags,
        ui_mobile_device_id: uiMobileDeviceId,
        ohs_accommodation_type_ids: ohsAccommodationTypeIds
    }
}

export const parseWorkstationFormData = (formData: FormData): WorkstationFormValues => {

    // asset_tag
    const assetTag = formData.get("assetTag") as string

    // model_id
    const rawModelId = formData.get("model")
    const modelId = Number(rawModelId)

    // office_number
    const officeNumber = formData.get("officeNumber") as string

    // notes
    const rawNotes = formData.get("notes") as string
    const notes = rawNotes || null

    return {
        asset_tag: assetTag,
        model_id: modelId,
        office_number: officeNumber,
        notes
    }
}

export const parseMobileDeviceFormData = (formData: FormData): MobileDeviceFormValues => {
    // id
    const rawId = formData.get("id")
    const id = rawId ? Number(rawId) : undefined

    // imei
    const rawImei = formData.get("imei") as string
    const imei = rawImei || null

    // notes
    const rawNotes = formData.get("notes") as string
    const notes = rawNotes || null

    // model_id
    const rawModelId = formData.get("model")
    const modelId = Number(rawModelId)

    // office_number
    const officeNumber = formData.get("officeNumber") as string

    return {
        id,
        imei,
        notes,
        model_id: modelId,
        office_number: officeNumber,
    }
}
