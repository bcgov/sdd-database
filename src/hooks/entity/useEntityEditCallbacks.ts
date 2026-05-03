import {useCallback} from "react";

import {EntityType} from "@/types";


interface UseEntityEditCallbacksProps {
    entityType: EntityType
    refreshSearchResults: () => void
    setIsEditModalOpen: (isOpen: boolean) => void
    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void

}

export function useEntityEditCallbacks({
                                           entityType,
                                           refreshSearchResults,
                                           setIsEditModalOpen,
                                           addSuccessAlert,
                                           addErrorAlert
                                       }: UseEntityEditCallbacksProps) {

    const onEditSuccess = useCallback(() => {

        refreshSearchResults();

        setIsEditModalOpen(false);

        switch (entityType) {
            case "employee":
                addSuccessAlert("Employee details updated.");
                break;

            case "workstation":
                addSuccessAlert("Workstation details updated.");
                break;

            default:
                break;
        }

    }, [refreshSearchResults, setIsEditModalOpen, entityType, addSuccessAlert]);

    const onEditError = useCallback((error: string) => {

        setIsEditModalOpen(false);

        switch (entityType) {
            case "employee":
                addErrorAlert("Error: Could not edit employee", error);
                break;

            case "workstation":
                addErrorAlert("Error: Could not edit workstation", error);
                break;

            default:
                addErrorAlert("Error: Could not update record", error);
                break;

        }
    }, [setIsEditModalOpen, entityType, addErrorAlert]);

    return {
        onEditSuccess,
        onEditError
    };
}
