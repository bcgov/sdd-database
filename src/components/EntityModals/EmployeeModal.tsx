import {ModalDialog} from "@/components/ModalDialog";
import {EmployeeForm} from "@/components/EntityForms/Employee/EmployeeForm";
import {AssignMode, EmployeeEntity} from "@/types";
import {ENTITY_TYPE_NAME} from "@/utils";


interface EmployeeModalProps {
    employee: EmployeeEntity

    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>

    handleRemoveWorkspace: () => void
    handleRemoveWorkstation: (assetTag: string) => void
    handleRemoveMobileDevice: () => void

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

    onSuccess: () => void
    onError: (error: string) => void
    onDelete: () => void
}

export function EmployeeModal({
                                  employee,

                                  activateAssignMode,

                                  handleRemoveWorkspace,
                                  handleRemoveWorkstation,
                                  handleRemoveMobileDevice,

                                  isOpen,
                                  setIsOpen,

                                  onSuccess,
                                  onError,
                                  onDelete,
                              }: EmployeeModalProps) {

    const onClose = () => setIsOpen(false);

    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={setIsOpen}
                     modalTitle={`Edit ${ENTITY_TYPE_NAME.employee}`}
        >
            <EmployeeForm employee={employee}

                          activateAssignMode={activateAssignMode}

                          handleRemoveWorkspace={handleRemoveWorkspace}
                          handleRemoveWorkstation={handleRemoveWorkstation}
                          handleRemoveMobileDevice={handleRemoveMobileDevice}

                          onSuccess={onSuccess}
                          onError={onError}
                          onDelete={onDelete}
                          onClose={onClose}
            >
            </EmployeeForm>
        </ModalDialog>

    )
}
