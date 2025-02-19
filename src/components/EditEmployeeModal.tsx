import {Button, ButtonGroup, Callout} from "@bcgov/design-system-react-components";
import {EmployeeForm} from "@/components/EmployeeForm";
import {EmployeeModal} from "@/components/EmployeeModal";
import {Employee} from "@/types/Employee"

interface EditEmployeeModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (formData: FormData) => void;
    employee?: Employee;
    onDelete: () => void;
}

export function EditEmployeeModal({isOpen, onOpenChange, onSubmit, employee, onDelete}: EditEmployeeModalProps) {
    return (
        <EmployeeModal isOpen={isOpen}
                       onOpenChange={onOpenChange}
                       modalTitle="Edit Employee">
            <div style={{
                marginTop: "1rem",
                marginBottom: "1rem",
            }}>
                <Callout title="Info"
                         description="Edit employee information as you want and then click  'Update' to save your changes in the database. Subsequently, you should see a Success Alert message on the Home Screen."/>
            </div>
            <div style={{
                // backgroundColor: "lightyellow",
                display: "flex",
                // flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end"
            }}>
                <EmployeeForm onSubmit={onSubmit}
                              employee={employee}
                              onCancel={() => onOpenChange(false)}
                              submitButtonLabel="Update"/>
                {/*<div style={{backgroundColor: "orange"}}>*/}
                <ButtonGroup alignment="end">
                    <Button variant="secondary"
                            danger
                            onPress={onDelete}>Delete</Button>
                </ButtonGroup>
                {/*</div>*/}
            </div>
        </EmployeeModal>
    )
}