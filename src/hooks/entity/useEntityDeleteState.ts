import {startTransition, useCallback, useState} from "react";

import {Entity, EntityActionResult, EmployeeEntity, WorkstationEntity} from "@/types";

type DeletableEntity = EmployeeEntity | WorkstationEntity;

interface UseEntityDeleteStateProps {
    viewedEntity: DeletableEntity | undefined

    setIsEntityModalOpen: (isOpen: boolean) => void

    setOptimisticSearchResults: (entity: Entity) => void
    refreshSearchResults: () => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void

    deleteEntity: (entity: DeletableEntity) => Promise<EntityActionResult>
    getEntityName: (entity: DeletableEntity) => string
}

export function useEntityDeleteState({
                                         viewedEntity,

                                         setIsEntityModalOpen,

                                         setOptimisticSearchResults,
                                         refreshSearchResults,

                                         addSuccessAlert,
                                         addErrorAlert,

                                         deleteEntity,
                                         getEntityName,
                                     }: UseEntityDeleteStateProps) {

    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

    const removeEntity = useCallback(async () => {
        if (!viewedEntity) return

        startTransition(() => {
            setOptimisticSearchResults(viewedEntity);
        })

        setIsDeleteAlertDialogOpen(false)
        setIsEntityModalOpen(false)

        const entityName = getEntityName(viewedEntity)
        const entityTypeName = viewedEntity.type === "employee" ? "Employee" : "Workstation"

        try {
            const result = await deleteEntity(viewedEntity)

            if (result.status === "ok") {
                addSuccessAlert(`${entityTypeName} '${entityName}' deleted!`)
            } else if (result.status === "error") {
                addErrorAlert(
                    `Error: Could not delete ${entityTypeName.toLowerCase()}`,
                    result.error,
                )
            }
        } finally {
            refreshSearchResults()
        }
    }, [
        viewedEntity,
        setOptimisticSearchResults,
        setIsEntityModalOpen,
        getEntityName,
        deleteEntity,
        addSuccessAlert,
        addErrorAlert,
        refreshSearchResults
    ])

    return {
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,

        removeEntity
    }
}