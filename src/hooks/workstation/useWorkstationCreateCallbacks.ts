import {useCallback} from "react";


interface UseWorkstationCreateCallbacksProps {
    refreshSearchResults: () => void

    openCloseAddNewWorkstationModal: (openModal: boolean) => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void
}

export function useWorkstationCreateCallbacks({
                                                  refreshSearchResults,

                                                  openCloseAddNewWorkstationModal,

                                                  addSuccessAlert,
                                                  addErrorAlert
                                              }: UseWorkstationCreateCallbacksProps) {
    const onAddNewWorkstationSuccess = useCallback(() => {
        refreshSearchResults()

        openCloseAddNewWorkstationModal(false)

        addSuccessAlert(`New workstation added!`);
    }, [
        refreshSearchResults,
        openCloseAddNewWorkstationModal,
        addSuccessAlert
    ])

    const onAddNewWorkstationError = useCallback((error: string) => {
        openCloseAddNewWorkstationModal(false)

        addErrorAlert("Error: Could not add new workstation", error)
    }, [
        openCloseAddNewWorkstationModal,
        addErrorAlert
    ])

    return {
        onAddNewWorkstationSuccess,
        onAddNewWorkstationError,
    }
}
