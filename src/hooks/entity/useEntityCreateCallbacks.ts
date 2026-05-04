import {useCallback} from "react";
import {EntityType} from "@/types";
import {ENTITY_TYPE_NAME} from "@/utils";


interface UseEntityCreateCallbacksProps {
    entityType: EntityType

    refreshSearchResults: () => void

    closeCreateModal: () => void
    closeCreateModalOnError?: () => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void
}

export function useEntityCreateCallbacks({
                                             entityType,

                                             refreshSearchResults,

                                             closeCreateModal,
                                             closeCreateModalOnError,

                                             addSuccessAlert,
                                             addErrorAlert
                                         }: UseEntityCreateCallbacksProps) {

    const entityName = ENTITY_TYPE_NAME[entityType]

    const onCreateSuccess = useCallback(() => {
        refreshSearchResults()

        closeCreateModal()

        addSuccessAlert(`New ${entityName} added!`)
    }, [
        refreshSearchResults,
        closeCreateModal,
        addSuccessAlert,
        entityName
    ])

    const onCreateError = useCallback((error: string) => {

        if (closeCreateModalOnError) {
            closeCreateModalOnError()
        } else {
            closeCreateModal()
        }

        addErrorAlert(`Error: Could not add new ${entityName}`, error)
    }, [
        closeCreateModalOnError,
        closeCreateModal,
        addErrorAlert,
        entityName
    ])

    return {
        onCreateSuccess,
        onCreateError
    }
}
