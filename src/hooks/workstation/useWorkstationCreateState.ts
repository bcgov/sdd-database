import {useCallback, useState} from "react";


export function useWorkstationCreateState() {
    const [isAddNewWorkstationModalOpen, setIsAddNewWorkstationModalOpen] = useState(false)

    const openCloseAddNewWorkstationModal = useCallback((openModal: boolean) => {
        setIsAddNewWorkstationModalOpen(openModal)
    }, [])

    return {
        isAddNewWorkstationModalOpen,
        openCloseAddNewWorkstationModal
    }
}
