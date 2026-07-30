import { ModalDialog } from "@/components/ModalDialog";
import { WorkstationForm } from "@/components/EntityForms/Workstation/WorkstationForm";
import { WorkstationEntity } from "@/types";
import { ENTITY_TYPE_NAME } from "@/utils";

interface WorkstationModalProps {
  workstation: WorkstationEntity;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  onSuccess: () => void;
  onError: (error: string) => void;
  onDelete: () => void;
}

export function WorkstationModal({
  workstation,

  isOpen,
  setIsOpen,

  onSuccess,
  onError,
  onDelete,
}: WorkstationModalProps) {
  const onClose = () => setIsOpen(false);

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalTitle={`Edit ${ENTITY_TYPE_NAME.workstation}`}
    >
      <WorkstationForm
        workstation={workstation}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
        onDelete={onDelete}
      ></WorkstationForm>
    </ModalDialog>
  );
}
