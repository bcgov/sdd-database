import {EmployeeEntity, EmployeeFormValues} from "@/types";
import {useCallback, useState} from "react";


export function useEmployeeEditorState() {

    const [draftNewEmployee, setDraftNewEmployee] = useState<EmployeeFormValues>();
    const [draftEditEmployee, setDraftEditEmployee] = useState<EmployeeEntity>();

    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);

    const clearDraftEditEmployee = useCallback(() => {
        setDraftEditEmployee(undefined)
    }, [])

    const openCloseAddNewEmployeeModal = useCallback((openModal: boolean, clearDraftEditsOnClose: boolean = true) => {
        setIsAddNewEmployeeModalOpen(openModal)

        if (!openModal && clearDraftEditsOnClose) {
            setDraftNewEmployee(undefined)
        }
    }, [])

    return {
        draftNewEmployee,
        setDraftNewEmployee,

        draftEditEmployee,
        setDraftEditEmployee,
        clearDraftEditEmployee,

        isAddNewEmployeeModalOpen,
        openCloseAddNewEmployeeModal,
    }
}
