import {useCallback, useState} from "react";
import {Entity} from "@/types";


interface UseEntitySelectionStateProps {
    setIsEditModalOpen: (isOpen: boolean) => void
    clearDraftEditEmployee: () => void
}

export function useEntitySelectionState({
                                            setIsEditModalOpen,
                                            clearDraftEditEmployee,
                                        }: UseEntitySelectionStateProps) {
    
    const [viewedEntity, setViewedEntity] = useState<Entity>(); // entity currently selected/opened

    const openSearchResultEditModal = useCallback((item: Entity) => {
        setViewedEntity(item);

        if (item.type === "employee") {
            clearDraftEditEmployee()
        }

        setIsEditModalOpen(true)
    }, [
        clearDraftEditEmployee,
        setIsEditModalOpen,
    ])

    return {
        viewedEntity,
        setViewedEntity,

        openSearchResultEditModal,
    }
}
