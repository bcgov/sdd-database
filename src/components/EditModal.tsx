import {Callout} from "@bcgov/design-system-react-components";

import {Entity} from "@/types";

import {EmployeeForm} from "@/components/Entity_Forms/EmployeeForm";
import {OfficeForm} from "@/components/Entity_Forms/OfficeForm";
import {WorkstationForm} from "@/components/Entity_Forms/WorkstationForm";
import {ModalDialog} from "@/components/ModalDialog";

import {ENTITY_TYPE_NAME} from "@/utils";


interface EditModalProps {
    item: Entity
    activateAssignMode: (formData: FormData) => Promise<void>
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onSubmit: (formData: FormData) => void
    onSuccess: () => void
    onError: (error: string) => void
    onDelete: () => void
}

export function EditModal({
                              item,
                              activateAssignMode,
                              isOpen,
                              setIsOpen,
                              onSubmit,
                              onSuccess,
                              onError,
                              onDelete
                          }: EditModalProps) {

    const getModalBody = () => {
        let bodyComponent = null;

        const onClose = () => {
            setIsOpen(false);
        }

        switch (item.type) {
            case "employee":
                bodyComponent = <EmployeeForm employee={item}
                                              activateAssignMode={activateAssignMode}
                                              onSuccess={onSuccess}
                                              onError={onError}
                                              onDelete={onDelete}
                                              onClose={onClose}/>
                break

            case "office":
                bodyComponent = <OfficeForm onSubmit={onSubmit}
                                            office={item}
                                            onClose={onClose}/>
                break

            case "workstation":
                bodyComponent = <WorkstationForm onSubmit={onSubmit}
                                                 workstation={item}
                                                 onClose={onClose}/>
                break
        }

        return bodyComponent;
    }

    return (
        <>
            <ModalDialog isOpen={isOpen}
                         setIsOpen={setIsOpen}
                         modalTitle={`Edit ${ENTITY_TYPE_NAME[item.type]}`}>

                <div style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}>
                    <Callout title="Info"
                             description="Edit below information as you want and then click 'Save'. You should see a Success Alert message on the Home Screen."/>
                </div>

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
