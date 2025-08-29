import {Dispatch, SetStateAction, startTransition, useCallback, useState} from "react";
import type {Selection} from "@react-types/shared";

import {Employee} from "@prisma/client";

import {Entity} from "@/types";

import {deleteEmployeeAction} from "@/actions/employees";

import {getEmployeeFullName, parseEmployeeFormData} from "@/utils";


interface UseEntityActionsProps {
    setIsEditModalOpen: (isOpen: boolean) => void;

    addSuccessAlert: (description: string) => void;
    addErrorAlert: (title: string, description: string) => void;

    setSelectedFilterTags: Dispatch<SetStateAction<Selection>>
    setAssignMode: (assignMode: boolean) => void;
    setOptimisticSearchResults: (employeeId: string) => void;
    runSearch: (query?: string, searchOnlyOffices?: boolean) => Promise<void>;
    refreshSearchResults: () => void;
}

export function useEntityActions({
                                     setIsEditModalOpen,
                                     addSuccessAlert,
                                     addErrorAlert,
                                     setSelectedFilterTags,
                                     setAssignMode,
                                     setOptimisticSearchResults,
                                     runSearch,
                                     refreshSearchResults
                                 }: UseEntityActionsProps) {
    const [selectedSearchResult, setSelectedSearchResult] = useState<Entity>();

    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);
    const [isAddNewWorkstationModalOpen, setIsAddNewWorkstationModalOpen] = useState(false);

    const [draftNewEmployee, setDraftNewEmployee] = useState<Employee>();

    const openSearchResultEditModal = (item: Entity) => {
        setSelectedSearchResult(item);
        setIsEditModalOpen(true);
    }

    /** This function is called when the user clicks on "Assign Office" in the add new employee modal or the "Update
     * Office" button in the add new employee modal or the edit employee modal.
     * @param formData
     */
    const activateAssignMode = async (formData: FormData) => {

        const editedEmployee = parseEmployeeFormData(formData);

        setAssignMode(true);

        // get all offices
        // passing state as a parameter since setStates are async
        await runSearch(undefined, true)

        setSelectedFilterTags(new Set(["office"]));

        if (isAddNewEmployeeModalOpen) {

            setDraftNewEmployee(editedEmployee);

            openCloseAddNewEmployeeModal(false, false)
        } else {

            // we update the existing selectedSearchResult with any new edits before we showcase the assign office UI
            setSelectedSearchResult({
                ...editedEmployee,
                type: "employee",
            });

            setIsEditModalOpen(false);
        }
    }

    const assignOfficeClickHandler = (assignedOfficeNumber: string) => {

        setAssignMode(false)

        /** For add new employee modal, we use the draftNewEmployee state to track edits before user clicks
         * on "Assign Office".
         * For edit employee modal, we use the selectedSearchResult state to track edits before user clicks
         * on "Assign Office".
         */
        if (draftNewEmployee) {

            // We are in add new employee modal
            setDraftNewEmployee({
                ...draftNewEmployee,
                office_number: assignedOfficeNumber
            })

            openCloseAddNewEmployeeModal(true)
        } else {

            if (selectedSearchResult && selectedSearchResult.type === "employee") {

                // We are in edit employee modal
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    office_number: assignedOfficeNumber
                })

                setIsEditModalOpen(true)
            }
        }
    }

    const openCloseAddNewEmployeeModal = useCallback((openModal: boolean, clearDraftEditsOnClose: boolean = true) => {
        setIsAddNewEmployeeModalOpen(openModal)

        if (!openModal && clearDraftEditsOnClose) {
            setDraftNewEmployee(undefined)
        }
    }, [])

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

    const removeEmployeeById = async (employeeId: string) => {
        // Optimistic Overlay
        startTransition(() => {
            // This line below immediately applies excludeEmployeeReducer to remove that employee from the UI before
            // the server delete action is called (instant feedback).
            setOptimisticSearchResults(employeeId);
        })

        // close dialogs + toast
        setIsDeleteAlertDialogOpen(false)
        setIsEditModalOpen(false)

        if (selectedSearchResult?.type === "employee") {
            addSuccessAlert(`Employee '${getEmployeeFullName(selectedSearchResult)}' deleted!`)
        }

        // Server mutation
        try {
            await deleteEmployeeAction(employeeId);
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
        assignOfficeClickHandler,
        openCloseAddNewEmployeeModal,
        onAddNewEmployeeSuccess,
        onAddNewEmployeeError,
        onAddNewWorkstationSuccess,
        onAddNewWorkstationError,
        removeEmployeeById
    }
}
