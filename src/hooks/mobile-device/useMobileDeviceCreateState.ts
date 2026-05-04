import {useCallback, useState} from "react";


export function useMobileDeviceCreateState() {
    const [isAddNewMobileDeviceModalOpen, setIsAddNewMobileDeviceModalOpen] = useState(false)

    const openCloseAddNewMobileDeviceModal = useCallback((openModal: boolean) => {
        setIsAddNewMobileDeviceModalOpen(openModal)
    }, [])

    return {
        isAddNewMobileDeviceModalOpen,
        openCloseAddNewMobileDeviceModal,
    }
}
