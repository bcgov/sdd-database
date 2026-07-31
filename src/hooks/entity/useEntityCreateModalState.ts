import {useCallback, useState} from "react";


export function useEntityCreateModalState() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const openCloseCreateModal = useCallback((isOpen: boolean) => {
        setIsCreateModalOpen(isOpen)
    }, [])

    return {
        isCreateModalOpen,
        openCloseCreateModal
    }
}
