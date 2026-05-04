import {useState} from "react";


export function useEntityUIState() {
    const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);

    return {
        isEntityModalOpen,
        setIsEntityModalOpen,
    }
}
