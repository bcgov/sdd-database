import {EmployeeFormValues, EntityType, MobileDeviceFormValues, WorkstationFormValues} from "@/types";


export const ENTITY_TYPE_NAME: Record<EntityType, string> = {
    employee: "Employee",
    office: "Office",
    workspace: "Workspace",
    workstation: "Workstation",
    mobileDevice: "Mobile Device"
} as const;

export const parseEmployeeFormData = (formData: FormData): EmployeeFormValues => {

    // office_number
    const rawOfficeNumber = formData.get("officeNumber") as string
    const officeNumber = rawOfficeNumber !== "Unassigned" ? rawOfficeNumber : ""

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

    // program_area_id
    const rawProgramAreaId = formData.get("programArea")
    const programAreaId = Number(rawProgramAreaId)

    // job_title_id
    const rawJobTitleId = formData.get("jobTitle")
    const jobTitleId = rawJobTitleId ? Number(rawJobTitleId) : null

    // notes
    const rawNotes = formData.get("notes") as string
    const notes = rawNotes || null

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

    // ohs_accommodation_type_ids
    const rawOhsAccommodationTypeIds = formData.getAll("ohsAccommodationTypeIds")
    const ohsAccommodationTypeIds = rawOhsAccommodationTypeIds.map(value => Number(value))

    return {
        office_number: officeNumber,
        idir,
        first_name: firstName,
        alternate_name: alternateName,
        last_name: lastName,
        employee_id: employeeId,
        program_area_id: programAreaId,
        job_title_id: jobTitleId,
        notes,
        workspace_assignment_type_id: workspaceAssignmentTypeId,

        id,
        ui_branch_id: uiBranchId,
        ui_workspace_number: uiWorkspaceNumber,
        ui_workstation_asset_tags: uiWorkstationAssetTags,
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
    // imei
    const imei = formData.get("imei") as string

    // notes
    const rawNotes = formData.get("notes") as string
    const notes = rawNotes || null

    return {
        imei,
        notes
    }
}

export const getEmployeeFullName = (
    employee: {
        first_name: string
        alternate_name?: string | null
        last_name: string
    } | undefined
) => {

    let fullName = "";

    if (employee) {

        fullName = employee.alternate_name
            ? `${employee.first_name} (${employee.alternate_name}) ${employee.last_name}`
            : `${employee.first_name} ${employee.last_name}`
    }

    return fullName;
}
