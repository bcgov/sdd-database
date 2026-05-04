import {useCallback, useState} from "react";
import {Entity} from "@/types";


interface UseEntitySelectionStateProps {
    setIsEntityModalOpen: (isOpen: boolean) => void
    clearDraftEditEmployee: () => void
}

export function useEntitySelectionState({
                                            setIsEntityModalOpen,
                                            clearDraftEditEmployee,
                                        }: UseEntitySelectionStateProps) {
    
    const [viewedEntity, setViewedEntity] = useState<Entity>(); // entity currently selected/opened

    const openSearchResultEntityModal = useCallback((item: Entity) => {
        setViewedEntity(item);

        if (item.type === "employee") {
            clearDraftEditEmployee()
        }

        setIsEntityModalOpen(true)
    }, [
        clearDraftEditEmployee,
        setIsEntityModalOpen,
    ])

    return {
        viewedEntity,
        setViewedEntity,

        openSearchResultEntityModal,
    }
}
