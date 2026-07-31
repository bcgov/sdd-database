import { WorkspaceEntity } from "@/types";
import { ModalDialog } from "@/components/ModalDialog";
import { WorkspaceForm } from "@/components/EntityForms/Workspace/WorkspaceForm";
import { ENTITY_TYPE_NAME } from "@/utils";

interface WorkspaceModalProps {
  workspace: WorkspaceEntity;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  onSuccess: () => void;
  onError: (error: string) => void;
}

export function WorkspaceModal({
  workspace,
  isOpen,
  setIsOpen,
  onSuccess,
  onError,
}: WorkspaceModalProps) {
  const onClose = () => setIsOpen(false);

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalTitle={ENTITY_TYPE_NAME.workspace}
    >
      <WorkspaceForm
        key={`${workspace.office_number}-${workspace.workspace_number}-${isOpen}`}
        workspace={workspace}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
      ></WorkspaceForm>
    </ModalDialog>
  );
}
