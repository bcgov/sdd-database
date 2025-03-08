import {Callout} from "@bcgov/design-system-react-components";

import {EmployeeForm} from "@/components/Entity_Forms/EmployeeForm";
import {OfficeForm} from "@/components/Entity_Forms/OfficeForm";
import {ModalDialog} from "@/components/ModalDialog";

import {Entity} from "@/types/Entity";

interface EditModalProps {
    item: Entity
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void,
    onSubmit: (formData: FormData) => void,
    onDelete: () => void,
}

export function EditModal({
                              item,
                              isOpen,
                              setIsOpen,
                              onSubmit,
                              onDelete
                          }: EditModalProps) {

    const getModalTitle = () => {

        return `Edit ${item?.type === "employee" ? "Employee" : "Office"}`;
    }

    const getModalBody = () => {
        let bodyComponent = null;

        if (item?.type === "employee") {

            bodyComponent = <EmployeeForm onSubmit={onSubmit}
                                          employee={item}
                                          onClose={() => setIsOpen(false)}
                                          onDelete={onDelete}
            />

        } else if (item?.type === "office") {

            bodyComponent = <OfficeForm onSubmit={onSubmit}
                                        office={item}
                                        onClose={() => setIsOpen(false)}/>
        }

        return bodyComponent;
    }

    return (
        <>
            <ModalDialog isOpen={isOpen}
                         setIsOpen={setIsOpen}
                         modalTitle={getModalTitle()}>

                <div style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}>
                    <Callout title="Info"
                             description="Edit below information as you want and then click  'Save'. You should see a Success Alert message on the Home Screen."/>
                </div>

                <div style={{
                    // backgroundColor: "lightyellow",
                    // display: "flex",
                    // // flexDirection: "row",
                    // justifyContent: "space-between",
                    // alignItems: "flex-end"
                }}>
                    {getModalBody()} {/* this could be any item of type Entity i.e. Office, Employee*/}
                </div>
            </ModalDialog>
        </>
    )
}
