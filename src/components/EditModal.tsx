import {Callout} from "@bcgov/design-system-react-components";

import {AssignMode, Entity} from "@/types";

import {EmployeeForm} from "@/components/Entity_Forms/Employee/EmployeeForm";
import {OfficeForm} from "@/components/Entity_Forms/Office/OfficeForm";
import {WorkstationForm} from "@/components/Entity_Forms/Workstation/WorkstationForm";
import {WorkspaceForm} from "@/components/Entity_Forms/Workspace/WorkspaceForm";

import {ModalDialog} from "@/components/ModalDialog";

import {ENTITY_TYPE_NAME} from "@/utils";


interface EditModalProps {
    item: Entity
    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>
    handleRemoveWorkspace: () => void
    handleHoldWorkspace: () => void
    handleRemoveWorkspaceHold: () => void
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onSuccess: () => void
    onError: (error: string) => void
    onDelete: () => void
}

export function EditModal({
                              item,
                              activateAssignMode,
                              handleRemoveWorkspace,
                              handleHoldWorkspace,
                              handleRemoveWorkspaceHold,
                              isOpen,
                              setIsOpen,
                              onSuccess,
                              onError,
                              onDelete
                          }: EditModalProps) {

    const isEditableEntity = item.type === "employee";

    const modalVerb = isEditableEntity ? "Edit" : "";
    const modalTitle = `${modalVerb} ${ENTITY_TYPE_NAME[item.type]}`

    const getModalBody = () => {
        let bodyComponent = null;

        const onClose = () => setIsOpen(false);

        switch (item.type) {
            case "employee":
                bodyComponent =
                    <EmployeeForm employee={item}
                                  activateAssignMode={activateAssignMode}
                                  handleRemoveWorkspace={handleRemoveWorkspace}
                                  onSuccess={onSuccess}
                                  onError={onError}
                                  onDelete={onDelete}
                                  onClose={onClose}>
                    </EmployeeForm>
                break

            case "office":
                bodyComponent = <OfficeForm office={item}/>
                break

            case "workspace":
                bodyComponent = <WorkspaceForm workspace={item}
                                               onHold={handleHoldWorkspace}
                                               onRemoveHold={handleRemoveWorkspaceHold}>
                </WorkspaceForm>
                break

            case "workstation":
                bodyComponent = <WorkstationForm workstation={item}/>
                break
        }

        return bodyComponent;
    }

    const displayCallout = () => {

        let calloutComponent = null;

        if (isEditableEntity) {   // this callout is only for editable entities
            calloutComponent = <div style={{
                marginTop: "1rem",
                marginBottom: "1rem",
            }}>
                <Callout title="Info"
                         description="Edit below information as you want and then click 'Save'. You should see a Success Alert message on the Home Screen."/>
            </div>
        }

        return calloutComponent;
    }

    return (
        <>
            <ModalDialog isOpen={isOpen}
                         setIsOpen={setIsOpen}
                         modalTitle={modalTitle}>

                {displayCallout()}

                <div style={{
                    // backgroundColor: "lightyellow",
                    // display: "flex",
                    // // flexDirection: "row",
                    // justifyContent: "space-between",
                    // alignItems: "flex-end"
                }}>
                    {getModalBody()} {/* this could be any item of type Entity i.e., Office, Employee*/}
                </div>
            </ModalDialog>
        </>
    )
}
