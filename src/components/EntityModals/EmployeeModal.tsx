import {ModalDialog} from "@/components/ModalDialog";
import {Callout} from "@bcgov/design-system-react-components";
import {EmployeeForm} from "@/components/EntityForms/Employee/EmployeeForm";
import {AssignMode, EmployeeEntity} from "@/types";
import {ENTITY_TYPE_NAME} from "@/utils";


interface EmployeeModalProps {
    employee: EmployeeEntity

    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>

    handleRemoveWorkspace: () => void
    handleRemoveWorkstation: (assetTag: string) => void

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
            <div style={{
                marginTop: "1rem",
                marginBottom: "1rem",
            }}>
                <Callout title="Info"
                         description="Edit below information as you want and then click 'Save'. You should see a Success Alert message on the Home Screen."/>
            </div>

            <EmployeeForm employee={employee}
                          activateAssignMode={activateAssignMode}
                          handleRemoveWorkspace={handleRemoveWorkspace}
                          handleRemoveWorkstation={handleRemoveWorkstation}
                          onSuccess={onSuccess}
                          onError={onError}
                          onDelete={onDelete}
                          onClose={onClose}
            >
            </EmployeeForm>
        </ModalDialog>

    )
}
