import {Dispatch, SetStateAction, startTransition, useCallback, useState} from "react";
import type {Selection} from "@react-types/shared";

import {AssignMode, SearchOptions} from "@/types";

import {deleteEmployeeAction} from "@/actions/entities/employees";

import {getEmployeeFullName} from "@/utils";
import {holdAction, removeHoldAction} from "@/actions/entities/workspaces";
import {useEmployeeEditorState} from "@/hooks/useEmployeeEditorState";


interface UseEntityActionsProps {
    setIsEditModalOpen: (isOpen: boolean) => void;

    addSuccessAlert: (description: string) => void;
    addErrorAlert: (title: string, description: string) => void;

    setSelectedFilterTags: Dispatch<SetStateAction<Selection>>

    setAssignMode: (assignMode: AssignMode) => void;
    setAssignEmployeeOfficeNumber: (officeNumber: string | undefined) => void;
    setAssignEmployeeProgramAreaId: (programAreaId: number | undefined) => void;

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
                                     setAssignEmployeeOfficeNumber,
                                     setAssignEmployeeProgramAreaId,
                                     setOptimisticSearchResults,
                                     runSearch,
                                     refreshSearchResults
                                 }: UseEntityActionsProps) {

    const [isAddNewWorkstationModalOpen, setIsAddNewWorkstationModalOpen] = useState(false);
    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

    const {
        draftNewEmployee,
        selectedSearchResult,
        setSelectedSearchResult,

        isAddNewEmployeeModalOpen,
        openCloseAddNewEmployeeModal,
        openSearchResultEditModal,

        saveEmployeeFormData,
        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        removeWorkspaceClickHandler

    } = useEmployeeEditorState({
        setIsEditModalOpen,
        addErrorAlert,

        setAssignMode,
        setAssignEmployeeOfficeNumber,
        setAssignEmployeeProgramAreaId,
    })

    /** This function is called when the user clicks on "Assign Workspace/Office" in the add new employee modal or the
     *  "Update Workspace/Office" button in the add new employee modal or the edit employee modal.
     * @param mode
     * @param formData
     */
    const activateAssignMode = async (mode: AssignMode, formData: FormData) => {

        if (mode === "workspace") {
            const employeeOfficeNumber = formData.get("officeNumber") as string;
            const rawEmployeeProgramAreaId = formData.get("programArea") as string;
            const employeeProgramAreaId = rawEmployeeProgramAreaId ? Number(rawEmployeeProgramAreaId) : undefined;

            if (!employeeOfficeNumber) {
                addErrorAlert(
                    "Error: Office required",
                    "Please assign an office before assigning a workspace"
                )
                return
            }

            if (employeeProgramAreaId == null || Number.isNaN(employeeProgramAreaId)) {
                addErrorAlert(
                    "Error: Program Area required",
                    "Please select a valid Program Area before assigning a workspace"
                )
                return
            }

            setAssignEmployeeOfficeNumber(employeeOfficeNumber)
            setAssignEmployeeProgramAreaId(employeeProgramAreaId)

            await enterAssignMode(mode, formData, employeeOfficeNumber, employeeProgramAreaId)
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
     * @param employeeOfficeNumber
     * @param employeeProgramAreaId
     */
    const enterAssignMode = async (
        mode: AssignMode,
        formData: FormData,
        employeeOfficeNumber?: string,
        employeeProgramAreaId?: number
    ) => {

        setAssignMode(mode);

        // passing mode as a parameter since setStates are async
        await runSearch(
            undefined,
            {
                modeOverride: mode,
                employeeOfficeNumber,
                employeeProgramAreaId
            }
        )

        setSelectedFilterTags(new Set([mode]));

        saveEmployeeFormData(formData);
    }

    const cancelAssignModeHandler = useCallback(() => {
        setAssignMode("none")

        // Clear any workspace-assignment office constraint and program area id constraint when leaving assign mode.
        // This mainly matters for workspace assignment and is harmless for office assignment.
        setAssignEmployeeOfficeNumber(undefined)
        setAssignEmployeeProgramAreaId(undefined)

        if (draftNewEmployee) {
            openCloseAddNewEmployeeModal(true)
        } else {
            if (selectedSearchResult?.type === "employee") {
                setIsEditModalOpen(true)
            }
        }
    }, [
        draftNewEmployee,
        selectedSearchResult,
        openCloseAddNewEmployeeModal
    ])

    const holdWorkspaceClickHandler = async () => {
        if (selectedSearchResult?.type !== "workspace") {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage"
            );
        } else {
            const result = await holdAction(
                selectedSearchResult.office_number,
                selectedSearchResult.workspace_number
            )

            if (result.status === "error") {
                addErrorAlert(
                    `Error: Could not put workspace ${selectedSearchResult.workspace_number} on hold`,
                    result.error
                )
            } else if (result.status === "ok") {

                updateSelectedWorkspaceHoldState(true)

                addSuccessAlert(`Workspace ${selectedSearchResult.workspace_number} marked on hold!`)

                refreshSearchResults()
            }
        }
    }

    const removeHoldWorkspaceClickHandler = async () => {
        if (selectedSearchResult?.type !== "workspace") {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage"
            );
        } else {
            const result = await removeHoldAction(
                selectedSearchResult.office_number,
                selectedSearchResult.workspace_number
            )

            if (result.status === "error") {
                addErrorAlert(
                    `Error: Could not remove workspace ${selectedSearchResult.workspace_number} from hold status`,
                    result.error
                )
            } else if (result.status === "ok") {

                updateSelectedWorkspaceHoldState(false)

                addSuccessAlert(`Workspace ${selectedSearchResult.workspace_number} is no longer on hold!`)

                refreshSearchResults()
            }
        }
    }

    const updateSelectedWorkspaceHoldState = (isOnHold: boolean) => {
        setSelectedSearchResult(prev => {
            if (!prev || prev.type !== "workspace") {
                return prev
            }

            return {
                ...prev,
                is_on_hold: isOnHold,
            }
        })
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

        const employeeName = selectedSearchResult?.type === "employee"
            ? getEmployeeFullName(selectedSearchResult)
            : undefined

        try {
            const result = await deleteEmployeeAction(id)

            if (result.status === "ok") {
                addSuccessAlert(employeeName
                    ? `Employee '${employeeName}' deleted!`
                    : `Employee deleted!`
                )
            } else {
                if (result.status === "error") {
                    addErrorAlert(
                        "Error: Could not delete employee",
                        result.error,
                    )
                }
            }
        } finally {
            // always re-sync with DB
            refreshSearchResults()
        }
    }

    return {
        selectedSearchResult,
        draftNewEmployee,

        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,

        activateAssignMode,
        cancelAssignModeHandler,
        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        removeWorkspaceClickHandler,

        holdWorkspaceClickHandler,
        removeHoldWorkspaceClickHandler,

        isAddNewEmployeeModalOpen,
        isAddNewWorkstationModalOpen,
        setIsAddNewWorkstationModalOpen,
        openSearchResultEditModal,
        openCloseAddNewEmployeeModal,

        onAddNewEmployeeSuccess,
        onAddNewEmployeeError,
        onAddNewWorkstationSuccess,
        onAddNewWorkstationError,

        removeEmployeeById
    }
}
