import {useState} from "react";


export function useEntityUIState() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return {
        isEditModalOpen,
        setIsEditModalOpen,
    }
}