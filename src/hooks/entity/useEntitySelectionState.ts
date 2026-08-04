import {useCallback, useState} from "react";
import {Entity} from "@/types";


interface UseEntitySelectionStateProps {
    setIsEntityModalOpen: (isOpen: boolean) => void
    clearDraftEditEmployee: () => void
    clearDraftEditMobileDevice: () => void
}

export function useEntitySelectionState({
                                            setIsEntityModalOpen,
                                            clearDraftEditEmployee,
                                            clearDraftEditMobileDevice,
                                        }: UseEntitySelectionStateProps) {
    
    const [viewedEntity, setViewedEntity] = useState<Entity>(); // entity currently selected/opened

    const openSearchResultEntityModal = useCallback((item: Entity) => {
        setViewedEntity(item);

        if (item.type === "employee") {
            clearDraftEditEmployee()
        }

        if (item.type === "mobileDevice") {
            clearDraftEditMobileDevice()
        }

        setIsEntityModalOpen(true)
    }, [
        clearDraftEditEmployee,
        clearDraftEditMobileDevice,
        setIsEntityModalOpen,
    ])

    return {
        viewedEntity,
        setViewedEntity,

        openSearchResultEntityModal,
    }
}
