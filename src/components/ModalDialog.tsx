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
          maxHeight: "calc(100dvh - 2rem)",
          maxWidth: "calc(100vw - 2rem)",
          // Unlike "hidden", "clip" cannot be programmatically scrolled when
          // React Aria moves focus to a control lower in the modal.
          overflow: "clip",
        }}
      >
        <Dialog aria-label={modalTitle}>
          <div
            style={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100dvh - 2rem)",
              minHeight: 0,
              overflow: "clip",
              padding: "1rem",
            }}
          >
            <Heading level={4}>{modalTitle}</Heading>
            <div
              style={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                minHeight: 0,
                overflow: "clip",
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
