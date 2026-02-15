import {Callout} from "@bcgov/design-system-react-components";

import {Entity} from "@/types";

import {EmployeeForm} from "@/components/Entity_Forms/EmployeeForm";
import {OfficeForm} from "@/components/Entity_Forms/Office/OfficeForm";
import {WorkstationForm} from "@/components/Entity_Forms/WorkstationForm";
import {ModalDialog} from "@/components/ModalDialog";

import {ENTITY_TYPE_NAME} from "@/utils";


interface EditModalProps {
    item: Entity
    activateAssignMode: (formData: FormData) => Promise<void>
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onSuccess: () => void
    onError: (error: string) => void
    onDelete: () => void
}

export function EditModal({
                              item,
                              activateAssignMode,
                              isOpen,
                              setIsOpen,
                              onSuccess,
                              onError,
                              onDelete
                          }: EditModalProps) {

    const modalVerb = item.type !== "office" ? "Edit" : "";
    const modalTitle = `${modalVerb} ${ENTITY_TYPE_NAME[item.type]}`

    const getModalBody = () => {
        let bodyComponent = null;

        const onClose = () => setIsOpen(false);

        switch (item.type) {
            case "employee":
                bodyComponent =
                    <EmployeeForm employee={item}
                                  activateAssignMode={activateAssignMode}
                                  onSuccess={onSuccess}
                                  onError={onError}
                                  onDelete={onDelete}
                                  onClose={onClose}>
                    </EmployeeForm>
                break

            case "office":
                bodyComponent = <OfficeForm office={item}/>
                break

            case "workstation":
                bodyComponent = <WorkstationForm onSuccess={onSuccess}
                                                 onError={onError}
                                                 workstation={item}
                                                 onClose={onClose}/>
                break
        }

        return bodyComponent;
    }

    const displayCallout = () => {

        let calloutComponent = null;

        if (item.type !== "office") {   // this callout is only for editable entities
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
