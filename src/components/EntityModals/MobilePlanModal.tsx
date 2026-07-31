import { MobilePlanEntity } from "@/types";
import { ModalDialog } from "@/components/ModalDialog";
import { MobilePlanForm } from "@/components/EntityForms/MobilePlan/MobilePlanForm";
import { ENTITY_TYPE_NAME } from "@/utils";

interface MobilePlanModalProps {
  mobilePlan: MobilePlanEntity;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  onSuccess: () => void;
  onError: (error: string) => void;
}

export function MobilePlanModal({
  mobilePlan,

  isOpen,
  setIsOpen,
  onSuccess,
  onError,
}: MobilePlanModalProps) {
  const onClose = () => setIsOpen(false);

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalTitle={`Edit ${ENTITY_TYPE_NAME.mobilePlan}`}
    >
      <MobilePlanForm
        mobilePlan={mobilePlan}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
      />
    </ModalDialog>
  );
}
