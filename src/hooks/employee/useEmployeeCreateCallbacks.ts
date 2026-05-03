import {useCallback} from "react";


interface UseEmployeeCreateCallbacksProps {
    refreshSearchResults: () => void

    openCloseAddNewEmployeeModal: (openModal: boolean, clearDraftEditsOnClose?: boolean) => void

    addSuccessAlert: (description: string) => void
    addErrorAlert: (title: string, description: string) => void
}

export function useEmployeeCreateCallbacks({
                                           refreshSearchResults,

                                           openCloseAddNewEmployeeModal,

                                           addSuccessAlert,
                                           addErrorAlert,
                                       }: UseEmployeeCreateCallbacksProps) {
    const onAddNewEmployeeSuccess = useCallback(() => {

        refreshSearchResults()

        openCloseAddNewEmployeeModal(false)

        addSuccessAlert(`New employee added!`);

    }, [
        openCloseAddNewEmployeeModal,
        refreshSearchResults,
        addSuccessAlert
    ])

    const onAddNewEmployeeError = useCallback((error: string) => {

        openCloseAddNewEmployeeModal(false, false)

        addErrorAlert("Error: Could not add new employee", error)

    }, [
        openCloseAddNewEmployeeModal,
        addErrorAlert
    ])

    return {
        onAddNewEmployeeSuccess,
        onAddNewEmployeeError,
    }
}
