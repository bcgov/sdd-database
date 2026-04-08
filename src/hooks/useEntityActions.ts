import {Dispatch, SetStateAction, startTransition, useCallback, useState} from "react";
import type {Selection} from "@react-types/shared";

import {AssignMode, EmployeeFormValues, Entity, SearchOptions} from "@/types";

import {deleteEmployeeAction} from "@/actions/entities/employees";

import {getEmployeeFullName, parseEmployeeFormData} from "@/utils";


interface UseEntityActionsProps {
    setIsEditModalOpen: (isOpen: boolean) => void;

    addSuccessAlert: (description: string) => void;
    addErrorAlert: (title: string, description: string) => void;

    setSelectedFilterTags: Dispatch<SetStateAction<Selection>>

    setAssignMode: (assignMode: AssignMode) => void;
    setAssignOfficeNumber: (officeNumber: string | undefined) => void;

    setOptimisticSearchResults: (id: number) => void;
    runSearch: (query?: string, options?: SearchOptions) => Promise<void>;
    refreshSearchResults: () => void;
}

export function useEntityActions({
                                     setIsEditModalOpen,
                                     addSuccessAlert,
                                     addErrorAlert,
                                     setSelectedFilterTags,
                                     setAssignMode,
                                     setAssignOfficeNumber,
                                     setOptimisticSearchResults,
                                     runSearch,
                                     refreshSearchResults
                                 }: UseEntityActionsProps) {

    const [draftNewEmployee, setDraftNewEmployee] = useState<EmployeeFormValues>();
    const [selectedSearchResult, setSelectedSearchResult] = useState<Entity>();

    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);
    const [isAddNewWorkstationModalOpen, setIsAddNewWorkstationModalOpen] = useState(false);
    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

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

    /** This function is called when the user clicks on "Assign Workspace/Office" in the add new employee modal or the
     *  "Update Workspace/Office" button in the add new employee modal or the edit employee modal.
     * @param mode
     * @param formData
     */
    const activateAssignMode = async (mode: AssignMode, formData: FormData) => {

        if (mode === "workspace") {
            const officeNumber = formData.get("officeNumber") as string;

            if (officeNumber) {
                setAssignOfficeNumber(officeNumber)
                await enterAssignMode(mode, formData, officeNumber)
            } else {
                addErrorAlert(
                    "Error: Office required",
                    "Please assign an office before assigning a workspace"
                )
            }
        }

        if (mode === "office") {
            await enterAssignMode(mode, formData)
        }

    }

    /**
     * Function does 3 things:
     * Setting the mode
     * setting the matching filter tag
     * running the right search
     * @param mode
     * @param formData
     * @param officeNumber
     */
    const enterAssignMode = async (
        mode: AssignMode,
        formData: FormData,
        officeNumber?: string
    ) => {

        setAssignMode(mode);

        // passing mode as a parameter since setStates are async
        await runSearch(undefined, {modeOverride: mode, officeNumber})

        setSelectedFilterTags(new Set([mode]));

        saveEmployeeFormData(formData);
    }

    /**
     * This function takes a snapshot of employee form data before closing the modal.
     * For add new employee modal, we use the draftNewEmployee state
     * For edit employee modal, we use the selectedSearchResult state
     *
     * @param formData
     */
    const saveEmployeeFormData = (formData: FormData) => {

        const employeeSnapshot: EmployeeFormValues = {
            ...parseEmployeeFormData(formData),
            ui_branch_id: Number(formData.get("branch")),
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

    const cancelAssignModeHandler = useCallback(() =>{
        setAssignMode("none")

        // Clear any workspace-assignment office constraint when leaving assign mode.
        // This mainly matters for workspace assignment and is harmless for office assignment.
        setAssignOfficeNumber(undefined)

        if (draftNewEmployee) {
            openCloseAddNewEmployeeModal(true)
        }
        else {
            if (selectedSearchResult?.type === "employee") {
                setIsEditModalOpen(true)
            }
        }
    }, [
        draftNewEmployee,
        selectedSearchResult,
        openCloseAddNewEmployeeModal
    ])

    const assignWorkspaceClickHandler = (assignedWorkspaceNumber: string) => {
        setAssignMode("none")
        setAssignOfficeNumber(undefined)

        if (draftNewEmployee) {
            // We are in add new employee modal
            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workspace_number: assignedWorkspaceNumber,
            })
            openCloseAddNewEmployeeModal(true)
        } else {
            if (selectedSearchResult?.type === "employee") {

                // We are in edit employee modal
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    ui_workspace_number: assignedWorkspaceNumber,
                })

                setIsEditModalOpen(true)
            }
        }
    }

    const assignOfficeClickHandler = (assignedOfficeNumber: string) => {
        setAssignMode("none")

        if (draftNewEmployee) {
            // We are in add new employee modal

            const officeChanged = draftNewEmployee.office_number !== assignedOfficeNumber

            const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : draftNewEmployee.ui_workspace_number

            setDraftNewEmployee({
                ...draftNewEmployee,
                office_number: assignedOfficeNumber,
                ui_workspace_number: nextWorkspaceNumber
            })
            openCloseAddNewEmployeeModal(true)
        } else {

            if (selectedSearchResult?.type === "employee") {

                const officeChanged = selectedSearchResult.office_number !== assignedOfficeNumber

                const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : selectedSearchResult.ui_workspace_number

                // We are in edit employee modal
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    office_number: assignedOfficeNumber,
                    ui_workspace_number: nextWorkspaceNumber,
                    workspace: officeChanged ? null : selectedSearchResult.workspace
                })

                setIsEditModalOpen(true)
            }
        }
    }

    const removeWorkspaceClickHandler = () => {
        if (draftNewEmployee) {
            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workspace_number: undefined
            })
        } else {
            if (selectedSearchResult?.type === "employee") {
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    ui_workspace_number: undefined,
                    workspace: null
                })
            }
        }
    }

    const onAddNewEmployeeSuccess = useCallback(() => {

        refreshSearchResults()

        openCloseAddNewEmployeeModal(false)

        addSuccessAlert(`New employee added!`);

    }, [openCloseAddNewEmployeeModal, refreshSearchResults, addSuccessAlert])

    const onAddNewEmployeeError = useCallback((error: string) => {

        openCloseAddNewEmployeeModal(false, false)

        addErrorAlert("Error: Could not add new employee", error)

    }, [openCloseAddNewEmployeeModal, addErrorAlert])

    const onAddNewWorkstationSuccess = useCallback(() => {
        refreshSearchResults()

        setIsAddNewWorkstationModalOpen(false)

        addSuccessAlert(`New workstation added!`);
    }, [refreshSearchResults, addSuccessAlert])

    const onAddNewWorkstationError = useCallback((error: string) => {
        setIsAddNewWorkstationModalOpen(false)

        addErrorAlert("Error: Could not add new workstation", error)
    }, [addErrorAlert])

    const removeEmployeeById = async (id: number) => {
        // Optimistic Overlay
        startTransition(() => {
            // This line below immediately applies excludeEmployeeReducer to remove that employee from the UI before
            // the server delete action is called (instant feedback).
            setOptimisticSearchResults(id);
        })

        // close dialogs + toast
        setIsDeleteAlertDialogOpen(false)
        setIsEditModalOpen(false)

        if (selectedSearchResult?.type === "employee") {
            addSuccessAlert(`Employee '${getEmployeeFullName(selectedSearchResult)}' deleted!`)
        }

        // Server mutation
        try {
            await deleteEmployeeAction(id);
        } finally {
            // always re-sync with DB
            refreshSearchResults()
        }
    }

    return {
        selectedSearchResult,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        isAddNewWorkstationModalOpen,
        setIsAddNewWorkstationModalOpen,
        draftNewEmployee,
        openSearchResultEditModal,
        activateAssignMode,
        cancelAssignModeHandler,
        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        removeWorkspaceClickHandler,
        openCloseAddNewEmployeeModal,
        onAddNewEmployeeSuccess,
        onAddNewEmployeeError,
        onAddNewWorkstationSuccess,
        onAddNewWorkstationError,
        removeEmployeeById
    }
}
