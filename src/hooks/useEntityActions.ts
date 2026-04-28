import {Dispatch, SetStateAction, startTransition, useCallback, useState} from "react";
import type {Selection} from "@react-types/shared";

import {AssignMode, SearchOptions} from "@/types";

import {getEmployeeFullName} from "@/utils";
import {holdAction, removeHoldAction} from "@/actions/entities/workspaces";
import {useEmployeeEditorState} from "@/hooks/useEmployeeEditorState";
import {deleteEmployeeAction} from "@/actions/entities/employee/actions";


interface UseEntityActionsProps {
    setIsEditModalOpen: (isOpen: boolean) => void;

    addSuccessAlert: (description: string) => void;
    addErrorAlert: (title: string, description: string) => void;

    setSelectedFilterTags: Dispatch<SetStateAction<Selection>>

    setAssignMode: (assignMode: AssignMode) => void;
    setAssignEmployeeOfficeNumber: (officeNumber: string | undefined) => void;
    setAssignEmployeeProgramAreaId: (programAreaId: number | undefined) => void;
    setAssignEmployeeWorkstationAssetTags: (assetTags: string[]) => void;

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
                                     setAssignEmployeeWorkstationAssetTags,

                                     setOptimisticSearchResults,
                                     runSearch,
                                     refreshSearchResults

                                 }: UseEntityActionsProps) {

    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

    const {
        viewedEntity,
        setViewedEntity,

        draftNewEmployee,
        draftEditEmployee,

        isAddNewEmployeeModalOpen,
        openCloseAddNewEmployeeModal,
        openSearchResultEditModal,

        saveEmployeeFormData,

        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        assignWorkstationClickHandler,
        removeWorkspaceClickHandler,
        removeWorkstationClickHandler,

    } = useEmployeeEditorState({
        setIsEditModalOpen,
        addErrorAlert,
        setAssignMode,
    })

    /** This function is called when the user clicks on "Assign Office/Workspace/Workstation" in the add new employee
     *  modal or the
     *  "Update Office/Workspace/Workstation" button in the add new employee modal or the edit employee modal.
     * @param mode
     * @param formData
     */
    const activateAssignMode = async (mode: AssignMode, formData: FormData) => {

        if (mode === "office") {
            await enterAssignMode(mode, formData)
        }

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

            await enterAssignMode(
                mode,
                formData,
                employeeOfficeNumber,
                employeeProgramAreaId
            )
        }

        if (mode === "workstation") {

            const employeeWorkstationAssetTags = formData
                .getAll("workstationAssetTags")
                .map(value => String(value))

            setAssignEmployeeWorkstationAssetTags(employeeWorkstationAssetTags)

            await enterAssignMode(
                mode,
                formData,
                undefined,
                undefined,
                employeeWorkstationAssetTags
            )
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
        employeeProgramAreaId?: number,
        employeeWorkstationAssetTags?: string[]
    ) => {

        setAssignMode(mode);

        // passing mode as a parameter since setStates are async
        await runSearch(
            undefined,
            {
                modeOverride: mode,
                employeeOfficeNumber,
                employeeProgramAreaId,
                employeeWorkstationAssetTags
            }
        )

        setSelectedFilterTags(new Set([mode]));

        saveEmployeeFormData(formData);
    }

    const cancelAssignModeHandler = useCallback(() => {
        setAssignMode("none")

        if (draftNewEmployee) {
            openCloseAddNewEmployeeModal(true)
            return
        }

        if (draftEditEmployee?.type === "employee") {
            setViewedEntity(draftEditEmployee)
            setIsEditModalOpen(true)
            return
        }

        // code should ideally never reach here
        // if it does, then something is wrong
        addErrorAlert(
            "Error: Something went wrong.",
            "Please refresh the webpage and try again"
        )

    }, [
        draftNewEmployee,
        draftEditEmployee,
        viewedEntity,
        openCloseAddNewEmployeeModal
    ])

    const holdWorkspaceClickHandler = async () => {
        if (viewedEntity?.type !== "workspace") {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage"
            )
        } else {
            const result = await holdAction(
                viewedEntity.office_number,
                viewedEntity.workspace_number
            )

            if (result.status === "error") {
                addErrorAlert(
                    `Error: Could not put workspace ${viewedEntity.workspace_number} on hold`,
                    result.error
                )
            } else if (result.status === "ok") {

                updateSelectedWorkspaceHoldState(true)

                addSuccessAlert(`Workspace ${viewedEntity.workspace_number} marked on hold!`)

                refreshSearchResults()
            }
        }
    }

    const removeHoldWorkspaceClickHandler = async () => {
        if (viewedEntity?.type !== "workspace") {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage"
            );
        } else {
            const result = await removeHoldAction(
                viewedEntity.office_number,
                viewedEntity.workspace_number
            )

            if (result.status === "error") {
                addErrorAlert(
                    `Error: Could not remove workspace ${viewedEntity.workspace_number} from hold status`,
                    result.error
                )
            } else if (result.status === "ok") {

                updateSelectedWorkspaceHoldState(false)

                addSuccessAlert(`Workspace ${viewedEntity.workspace_number} is no longer on hold!`)

                refreshSearchResults()
            }
        }
    }

    const updateSelectedWorkspaceHoldState = (isOnHold: boolean) => {
        setViewedEntity(prev => {
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

        const employeeName = viewedEntity?.type === "employee"
            ? getEmployeeFullName(viewedEntity)
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
        viewedEntity,
        draftNewEmployee,
        draftEditEmployee,

        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,

        activateAssignMode,
        cancelAssignModeHandler,
        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        assignWorkstationClickHandler,
        removeWorkspaceClickHandler,
        removeWorkstationClickHandler,

        holdWorkspaceClickHandler,
        removeHoldWorkspaceClickHandler,

        isAddNewEmployeeModalOpen,
        openSearchResultEditModal,
        openCloseAddNewEmployeeModal,

        onAddNewEmployeeSuccess,
        onAddNewEmployeeError,

        removeEmployeeById
    }
}
