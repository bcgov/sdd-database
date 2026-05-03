import {startTransition, useCallback, useState} from "react";

import {Entity} from "@/types";

import {getEmployeeFullName} from "@/utils";
import {deleteEmployeeAction} from "@/actions/entities/employee/actions";


interface useEmployeeDeleteStateProps {
    viewedEntity: Entity | undefined

    setIsEditModalOpen: (isOpen: boolean) => void

    setOptimisticSearchResults: (id: number) => void
    refreshSearchResults: () => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void
}

export function useEmployeeDeleteState({
                                     viewedEntity,

                                     setIsEditModalOpen,

                                     setOptimisticSearchResults,
                                     refreshSearchResults,

                                     addSuccessAlert,
                                     addErrorAlert,
                                 }: useEmployeeDeleteStateProps) {

    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

    const removeEmployeeById = useCallback(async (id: number) => {
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
    }, [
        setOptimisticSearchResults,
        setIsEditModalOpen,
        viewedEntity,
        addSuccessAlert,
        addErrorAlert,
        refreshSearchResults
    ])

    return {
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,

        removeEmployeeById
    }
}
