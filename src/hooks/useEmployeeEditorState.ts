import {AssignMode, EmployeeFormValues, Entity, SelectedWorkspaceAssignment} from "@/types";
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
    const [draftNewEmployee, setDraftNewEmployee] = useState<EmployeeFormValues>();
    const [selectedSearchResult, setSelectedSearchResult] = useState<Entity>();
    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);

    const openSearchResultEditModal = (item: Entity) => {
        setSelectedSearchResult(item);
        setIsEditModalOpen(true);
    }

    const openCloseAddNewEmployeeModal = useCallback((openModal: boolean, clearDraftEditsOnClose: boolean = true) => {
        setIsAddNewEmployeeModalOpen(openModal)

        if (!openModal && clearDraftEditsOnClose) {
            setDraftNewEmployee(undefined)
        }
    }, [])

    /**
     * This function takes a snapshot of employee form data before closing the modal.
     * For add new employee modal, we use the draftNewEmployee state
     * For edit employee modal, we use the selectedSearchResult state
     *
     * @param formData
     */
    const saveEmployeeFormData = (formData: FormData) => {

        let existingWorkspaceRestrictionUIState = {}

        if (isAddNewEmployeeModalOpen) {
            existingWorkspaceRestrictionUIState = {
                ui_workspace_restricted_program_area_id: draftNewEmployee?.ui_workspace_restricted_program_area_id
            }
        } else {
            if (selectedSearchResult?.type === "employee") {
                existingWorkspaceRestrictionUIState = {
                    ui_workspace_restricted_program_area_id:
                        selectedSearchResult.ui_workspace_restricted_program_area_id ??
                        selectedSearchResult.workspace?.restricted_program_area_id
                }
            }
        }

        const employeeSnapshot: EmployeeFormValues = {
            ...parseEmployeeFormData(formData),
            ...existingWorkspaceRestrictionUIState
        }

        if (isAddNewEmployeeModalOpen) {

            setDraftNewEmployee(employeeSnapshot);

            openCloseAddNewEmployeeModal(false, false)
        } else {

            // Preserve in-progress employee edits before leaving the modal for assign mode
            setSelectedSearchResult(prev => {

                // this is just defensible coding, code will ideally never branch in this block
                if (!prev || prev.type !== "employee") {
                    addErrorAlert("Error: Something went wrong.", "Please refresh the webpage and try again");
                    return prev
                }

                return {
                    ...prev,
                    ...employeeSnapshot,
                }
            })

            setIsEditModalOpen(false);
        }
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

            if (selectedSearchResult?.type === "employee") {

                const officeChanged = selectedSearchResult.office_number !== assignedOfficeNumber

                const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : selectedSearchResult.ui_workspace_number

                const nextWorkspaceRestrictedProgramAreaId: EmployeeFormValues["ui_workspace_restricted_program_area_id"] = officeChanged ? undefined : selectedSearchResult.ui_workspace_restricted_program_area_id

                // We are in edit employee modal
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    office_number: assignedOfficeNumber,
                    ui_workspace_number: nextWorkspaceNumber,
                    ui_workspace_restricted_program_area_id: nextWorkspaceRestrictedProgramAreaId,
                    workspace: officeChanged ? null : selectedSearchResult.workspace
                })

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
            if (selectedSearchResult?.type === "employee") {

                // We are in edit employee modal
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    ui_workspace_number: assignedWorkspace.workspace_number,
                    ui_workspace_restricted_program_area_id: assignedWorkspace.restricted_program_area_id
                })

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
            if (selectedSearchResult?.type === "employee") {

                const currentAssetTags = selectedSearchResult.ui_workstation_asset_tags ??
                    selectedSearchResult.workstations.map(
                        workstation => workstation.asset_tag
                    )

                const nextAssetTags = Array.from(
                    new Set([...currentAssetTags, assignedWorkstationAssetTag])
                )

                setSelectedSearchResult({
                    ...selectedSearchResult,
                    ui_workstation_asset_tags: nextAssetTags
                })

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
            if (selectedSearchResult?.type === "employee") {
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    ui_workspace_number: undefined,
                    ui_workspace_restricted_program_area_id: undefined,
                    workspace: null
                })
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
            if (selectedSearchResult?.type === "employee") {

                const currentAssetTags = selectedSearchResult.ui_workstation_asset_tags ??
                    selectedSearchResult.workstations.map(
                        workstation => workstation.asset_tag
                    )

                setSelectedSearchResult({
                    ...selectedSearchResult,
                    ui_workstation_asset_tags: currentAssetTags.filter(
                        currentAssetTag => currentAssetTag !== assetTag
                    )
                })
            }
        }
    }

    return {
        draftNewEmployee,
        selectedSearchResult,
        setSelectedSearchResult,

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
