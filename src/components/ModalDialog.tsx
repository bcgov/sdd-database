import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
} from "@bcgov/design-system-react-components";

interface ModalDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerButtonText?: string;
  modalTitle: string;
  children: React.ReactNode;
}

export function ModalDialog({
  isOpen,
  setIsOpen,
  triggerButtonText,
  modalTitle,
  children,
}: ModalDialogProps) {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      {triggerButtonText && (
        <Button size="large" variant="secondary">
          {triggerButtonText}
        </Button>
      )}
      <Modal
        style={{
          margin: "1rem",
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "hidden",
        }}
      >
        <Dialog>
          <div style={{ padding: "1rem" }}>
            <Heading level={4}>{modalTitle}</Heading>
            <div
              style={{
                maxHeight: "calc(100vh - 6rem)",
                overflowY: "auto",
                paddingRight: "0.5rem",
              }}
            >
              {children}
            </div>
          </div>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
