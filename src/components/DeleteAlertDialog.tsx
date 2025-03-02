import {AlertDialog, Button, DialogTrigger, Modal} from "@bcgov/design-system-react-components";

import {Employee} from "@prisma/client";

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
                                 <Button key="alert-dialog-button-1"
                                         danger onPress={onDelete}>Delete</Button>,
                                 <Button key="alert-dialog-button-2"
                                         variant="secondary"
                                         onPress={() => setIsOpen(false)
                                         }>Cancel</Button>
                             ]}
                />
            </Modal>
        </DialogTrigger>
    )
}
