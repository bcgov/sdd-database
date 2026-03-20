import {Dispatch, SetStateAction, startTransition, useCallback, useState} from "react";
import type {Selection} from "@react-types/shared";

import {EmployeeFormValues, Entity} from "@/types";

import {deleteEmployeeAction} from "@/actions/employees";

import {getEmployeeFullName, parseEmployeeFormData} from "@/utils";


interface UseEntityActionsProps {
    setIsEditModalOpen: (isOpen: boolean) => void;

    addSuccessAlert: (description: string) => void;
    addErrorAlert: (title: string, description: string) => void;

    setSelectedFilterTags: Dispatch<SetStateAction<Selection>>
    setAssignMode: (assignMode: boolean) => void;
    setOptimisticSearchResults: (id: number) => void;
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

    const [draftNewEmployee, setDraftNewEmployee] = useState<EmployeeFormValues>();

    const openSearchResultEditModal = (item: Entity) => {
        setSelectedSearchResult(item);
        setIsEditModalOpen(true);
    }

    /** This function is called when the user clicks on "Assign Office" in the add new employee modal or the "Update
     * Office" button in the add new employee modal or the edit employee modal.
     * @param formData
     */
    const activateAssignMode = async (formData: FormData) => {
        setAssignMode(true);

        // get all offices
        // passing state as a parameter since setStates are async
        await runSearch(undefined, true)

        setSelectedFilterTags(new Set(["office"]));

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

            // we update the existing selectedSearchResult with any new edits before we showcase the assign office UI
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

        setAssignMode(false)

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
        assignOfficeClickHandler,
        openCloseAddNewEmployeeModal,
        onAddNewEmployeeSuccess,
        onAddNewEmployeeError,
        onAddNewWorkstationSuccess,
        onAddNewWorkstationError,
        removeEmployeeById
    }
}
