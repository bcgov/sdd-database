import {AlertDialog, Button, DialogTrigger, Modal} from "@bcgov/design-system-react-components";

import {Employee} from "@prisma/client";

import {getEmployeeFullName} from "@/utils";


interface DeleteAlertDialogProps {
    employee: Employee;
    isOpen: boolean;
    setIsOpen: (isDeleteAlertDialogOpen: boolean) => void;
    /**
     * Optimistic-aware callback coming from `useSearch / useEntityActions`.
     * It **first** updates local UI (useOptimistic) and **then** calls the
     * server action that actually deletes the record.
     */
    onDelete: (employeeId: string) => Promise<void>;
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
                                         type="submit"
                                         danger
                                         onPress={() => onDelete(employee.employee_id)}>
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
