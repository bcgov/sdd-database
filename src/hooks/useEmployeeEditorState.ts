import {AssignMode, EmployeeEntity, EmployeeFormValues, Entity, SelectedWorkspaceAssignment} from "@/types";
import {useCallback, useState} from "react";
import {parseEmployeeFormData} from "@/utils";


interface UseEmployeeEditorStateProps {
    setIsEditModalOpen: (isOpen: boolean) => void;
    addErrorAlert: (title: string, description: string) => void;
    setAssignMode: (assignMode: AssignMode) => void;
}

export function useEmployeeEditorState({
                                           setIsEditModalOpen,
                                           addErrorAlert,
                                           setAssignMode,
                                       }: UseEmployeeEditorStateProps) {

    const [viewedEntity, setViewedEntity] = useState<Entity>(); // entity currently selected/opened

    const [draftNewEmployee, setDraftNewEmployee] = useState<EmployeeFormValues>();
    const [draftEditEmployee, setDraftEditEmployee] = useState<EmployeeEntity>();

    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);

    const openSearchResultEditModal = (item: Entity) => {
        setViewedEntity(item);

        if (item.type === "employee") {
            setDraftEditEmployee(undefined)
        }

        setIsEditModalOpen(true);
    }

    const openCloseAddNewEmployeeModal = useCallback((openModal: boolean, clearDraftEditsOnClose: boolean = true) => {
        setIsAddNewEmployeeModalOpen(openModal)

        if (!openModal && clearDraftEditsOnClose) {
            setDraftNewEmployee(undefined)
        }
    }, [])

    /**
     * Give me the employee currently being edited, whether it already has a draft or is still the originally viewed employee.
     */
    const getCurrentEditEmployee = () => {
        if (draftEditEmployee) return draftEditEmployee

        // we need this fallback since draftEditEmployee is undefined at the start when you first click on a
        // employee search result
        // In other words, no draft exists yet, so use the employee that was originally opened.
        if (viewedEntity?.type === "employee") return viewedEntity

        // defensive state
        return undefined
    }

    /**
     * This function takes a snapshot of employee form data before closing the modal.
     * For add new employee modal, we use the draftNewEmployee state
     * For edit employee modal, we use the draftEditEmployee state
     *
     * @param formData
     */
    const saveEmployeeFormData = (formData: FormData) => {

        // If we are NOT in Add New Employee mode, then we must be editing an existing employee.
        // So get the current edit employee draft.
        const editEmployee = !isAddNewEmployeeModalOpen
            ? getCurrentEditEmployee()
            : undefined

        // defensive check
        // If this is edit mode, but we somehow cannot find the employee being edited, stop.
        if (!isAddNewEmployeeModalOpen && !editEmployee) {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage and try again"
            )
            return
        }

        const existingWorkspaceRestrictionUIState = isAddNewEmployeeModalOpen
            ? {
                ui_workspace_restricted_program_area_id: draftNewEmployee?.ui_workspace_restricted_program_area_id
            }
            : {
                ui_workspace_restricted_program_area_id: editEmployee?.ui_workspace_restricted_program_area_id ??
                    editEmployee?.workspace?.restricted_program_area_id
            }

        const employeeSnapshot: EmployeeFormValues = {
            ...parseEmployeeFormData(formData),
            ...existingWorkspaceRestrictionUIState
        }

        if (isAddNewEmployeeModalOpen) {
            setDraftNewEmployee(employeeSnapshot);
            openCloseAddNewEmployeeModal(false, false)
            return
        }

        // defensive check
        if (!editEmployee) {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage and try again"
            )
            return
        }

        const nextEmployee = {
            ...editEmployee,
            ...employeeSnapshot,
        }
        // Preserve in-progress employee edits before leaving the modal for assign mode
        setDraftEditEmployee(nextEmployee)

        setIsEditModalOpen(false);
    }

    const assignOfficeClickHandler = (assignedOfficeNumber: string) => {
        setAssignMode("none")

        if (draftNewEmployee) {
            // We are in add new employee modal

            const officeChanged = draftNewEmployee.office_number !== assignedOfficeNumber

            const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : draftNewEmployee.ui_workspace_number

            const nextWorkspaceRestrictedProgramAreaId: EmployeeFormValues["ui_workspace_restricted_program_area_id"] = officeChanged ? undefined : draftNewEmployee.ui_workspace_restricted_program_area_id

            setDraftNewEmployee({
                ...draftNewEmployee,
                office_number: assignedOfficeNumber,
                ui_workspace_number: nextWorkspaceNumber,
                ui_workspace_restricted_program_area_id: nextWorkspaceRestrictedProgramAreaId,
            })
            openCloseAddNewEmployeeModal(true)
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const officeChanged = editEmployee.office_number !== assignedOfficeNumber

                const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : editEmployee.ui_workspace_number

                const nextWorkspaceRestrictedProgramAreaId: EmployeeFormValues["ui_workspace_restricted_program_area_id"] = officeChanged ? undefined : editEmployee.ui_workspace_restricted_program_area_id

                const nextEmployee = {
                    ...editEmployee,
                    office_number: assignedOfficeNumber,
                    ui_workspace_number: nextWorkspaceNumber,
                    ui_workspace_restricted_program_area_id: nextWorkspaceRestrictedProgramAreaId,
                    workspace: officeChanged ? null : editEmployee.workspace
                }

                setDraftEditEmployee(nextEmployee)
                setViewedEntity(nextEmployee)

                setIsEditModalOpen(true)
            }
        }
    }

    const assignWorkspaceClickHandler = (assignedWorkspace: SelectedWorkspaceAssignment) => {
        setAssignMode("none")

        if (draftNewEmployee) {
            // We are in add new employee modal
            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workspace_number: assignedWorkspace.workspace_number,
                ui_workspace_restricted_program_area_id: assignedWorkspace.restricted_program_area_id
            })
            openCloseAddNewEmployeeModal(true)
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const nextEmployee = {
                    ...editEmployee,
                    ui_workspace_number: assignedWorkspace.workspace_number,
                    ui_workspace_restricted_program_area_id: assignedWorkspace.restricted_program_area_id
                }

                setDraftEditEmployee(nextEmployee)
                setViewedEntity(nextEmployee)

                setIsEditModalOpen(true)
            }
        }
    }

    const assignWorkstationClickHandler = (assignedWorkstationAssetTag: string) => {
        setAssignMode("none")

        if (draftNewEmployee) {

            const currentAssetTags = draftNewEmployee.ui_workstation_asset_tags ?? []

            const nextAssetTags = Array.from(
                new Set([...currentAssetTags, assignedWorkstationAssetTag])
            )

            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workstation_asset_tags: nextAssetTags
            })

            openCloseAddNewEmployeeModal(true)
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const currentAssetTags = editEmployee.ui_workstation_asset_tags ??
                    editEmployee.workstations.map(
                        workstation => workstation.asset_tag
                    )

                const nextAssetTags = Array.from(
                    new Set([...currentAssetTags, assignedWorkstationAssetTag])
                )

                const nextEmployee = {
                    ...editEmployee,
                    ui_workstation_asset_tags: nextAssetTags
                }

                setDraftEditEmployee(nextEmployee)
                setViewedEntity(nextEmployee)

                setIsEditModalOpen(true)
            }
        }
    }

    const removeWorkspaceClickHandler = () => {
        if (draftNewEmployee) {
            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workspace_number: undefined,
                ui_workspace_restricted_program_area_id: undefined
            })
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const nextEmployee = {
                    ...editEmployee,
                    ui_workspace_number: undefined,
                    ui_workspace_restricted_program_area_id: undefined,
                    workspace: null
                }

                setDraftEditEmployee(nextEmployee)
            }
        }
    }

    const removeWorkstationClickHandler = (assetTag: string) => {
        if (draftNewEmployee) {

            const currentAssetTags = draftNewEmployee.ui_workstation_asset_tags ?? []

            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workstation_asset_tags: currentAssetTags.filter(
                    currentAssetTag => currentAssetTag !== assetTag
                )
            })
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const currentAssetTags = editEmployee.ui_workstation_asset_tags ??
                    editEmployee.workstations.map(
                        workstation => workstation.asset_tag
                    )

                const nextEmployee = {
                    ...editEmployee,
                    ui_workstation_asset_tags: currentAssetTags.filter(
                        currentAssetTag => currentAssetTag !== assetTag
                    )
                }

                setDraftEditEmployee(nextEmployee)
            }
        }
    }

    return {
        draftNewEmployee,
        draftEditEmployee,
        viewedEntity,
        setViewedEntity,

        isAddNewEmployeeModalOpen,
        openCloseAddNewEmployeeModal,
        openSearchResultEditModal,

        saveEmployeeFormData,

        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        removeWorkspaceClickHandler,
        assignWorkstationClickHandler,
        removeWorkstationClickHandler
    }
}
