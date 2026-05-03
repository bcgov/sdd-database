import {Entity} from "@/types";
import {holdAction, removeHoldAction} from "@/actions/entities/workspaces";
import {Dispatch, SetStateAction, useCallback} from "react";


interface UseWorkspaceActionsProps {
    viewedEntity: Entity | undefined
    setViewedEntity: Dispatch<SetStateAction<Entity | undefined>>

    refreshSearchResults: () => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void
}

export function useWorkspaceActions({
                                        viewedEntity,
                                        setViewedEntity,

                                        refreshSearchResults,

                                        addSuccessAlert,
                                        addErrorAlert,
                                    }: UseWorkspaceActionsProps) {

    const updateViewedWorkspaceHoldState = useCallback((isOnHold: boolean) => {
        setViewedEntity(prev => {
            if (!prev || prev.type !== "workspace") {
                return prev
            }

            return {
                ...prev,
                is_on_hold: isOnHold,
            }
        })
    }, [setViewedEntity])

    const holdWorkspaceClickHandler = useCallback(async () => {
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

                updateViewedWorkspaceHoldState(true)

                addSuccessAlert(`Workspace ${viewedEntity.workspace_number} marked on hold!`)

                refreshSearchResults()
            }
        }
    }, [
        viewedEntity,
        addErrorAlert,
        updateViewedWorkspaceHoldState,
        addSuccessAlert,
        refreshSearchResults
    ])

    const removeHoldWorkspaceClickHandler = useCallback(async () => {
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

                updateViewedWorkspaceHoldState(false)

                addSuccessAlert(`Workspace ${viewedEntity.workspace_number} is no longer on hold!`)

                refreshSearchResults()
            }
        }
    }, [
        viewedEntity,
        addErrorAlert,
        updateViewedWorkspaceHoldState,
        addSuccessAlert,
        refreshSearchResults
    ])

    return {
        holdWorkspaceClickHandler,
        removeHoldWorkspaceClickHandler,
    }
}
