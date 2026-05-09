import {startTransition, useCallback, useState} from "react";

import {Entity} from "@/types";

import {deleteEmployeeAction} from "@/actions/entities/employee/actions";
import {getEmployeeFullName} from "@/domain/employees";


interface useEmployeeDeleteStateProps {
    viewedEntity: Entity | undefined

    setIsEntityModalOpen: (isOpen: boolean) => void

    setOptimisticSearchResults: (id: number) => void
    refreshSearchResults: () => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void
}

export function useEmployeeDeleteState({
                                           viewedEntity,

                                           setIsEntityModalOpen,

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
        setIsEntityModalOpen(false)

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
        setIsEntityModalOpen,
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
