import {AlertDialog, Button, DialogTrigger, Form, Modal} from "@bcgov/design-system-react-components";

import {Employee} from "@prisma/client";

// import {deleteEmployeeAction} from "@/actions/employees";

import {getEmployeeFullName} from "@/utils";


interface DeleteAlertDialogProps {
    employee: Employee;
    isOpen: boolean;
    setIsOpen: (isDeleteAlertDialogOpen: boolean) => void;
    onDelete: () => void;
}


export function DeleteAlertDialog({employee, isOpen, setIsOpen, onDelete}: DeleteAlertDialogProps) {

    return (
        <DialogTrigger isOpen={isOpen}
                       onOpenChange={setIsOpen}>
            <Modal>
                <AlertDialog role="alertdialog" variant="destructive"
                             title={`Are you sure you want to delete this employee '${getEmployeeFullName(employee)}'?`}
                             buttons={[
                                 // <Form key="alert-dialog-button-1" action={deleteEmployeeAction.bind(null, employee.employee_id)}>
                                 //     <Button type="submit" danger>Delete</Button>
                                 // </Form>,
                                 <Button key="alert-dialog-button-1"
                                         type="submit"
                                         danger
                                         onPress={onDelete}>
                                     Delete
                                 </Button>,
                                 <Button key="alert-dialog-button-2"
                                         variant="secondary"
                                         onPress={() => setIsOpen(false)}>
                                     Cancel
                                 </Button>
                             ]}>
                </AlertDialog>
            </Modal>
        </DialogTrigger>
    )
}
