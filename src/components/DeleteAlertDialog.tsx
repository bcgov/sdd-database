import {
  AlertDialog,
  Button,
  DialogTrigger,
  Modal,
} from "@bcgov/design-system-react-components";

import { EmployeeEntity, WorkstationEntity } from "@/types";
import { getEmployeeFullName } from "@/domain/employees";

interface DeleteAlertDialogProps {
  entity: EmployeeEntity | WorkstationEntity;
  isOpen: boolean;
  setIsOpen: (isDeleteAlertDialogOpen: boolean) => void;
  onDelete: () => Promise<void>;
}

export function DeleteAlertDialog({
  entity,
  isOpen,
  setIsOpen,
  onDelete,
}: DeleteAlertDialogProps) {
  const entityName =
    entity.type === "employee"
      ? getEmployeeFullName(entity)
      : `${entity.workstation_model.name} (${entity.asset_tag})`;
  const entityTypeName =
    entity.type === "employee" ? "employee" : "workstation";

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal>
        <AlertDialog
          role="alertdialog"
          variant="destructive"
          title={`Are you sure you want to delete this ${entityTypeName} '${entityName}'?`}
          buttons={[
            <Button
              key="alert-dialog-button-1"
              type="submit"
              danger
              onPress={onDelete}
            >
              Delete
            </Button>,
            <Button
              key="alert-dialog-button-2"
              variant="secondary"
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>,
          ]}
        ></AlertDialog>
      </Modal>
    </DialogTrigger>
  );
}
