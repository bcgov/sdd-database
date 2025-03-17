import {Button, Dialog, DialogTrigger, Heading, Modal} from "@bcgov/design-system-react-components";

interface ModalDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    triggerButtonText?: string;
    disableTriggerButton?: boolean;
    modalTitle: string;
    children: React.ReactNode;
}

export function ModalDialog({
                                isOpen,
                                setIsOpen,
                                triggerButtonText,
                                disableTriggerButton,
                                modalTitle,
                                children
                            }: ModalDialogProps) {

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            {triggerButtonText &&
                <Button variant="secondary" isDisabled={disableTriggerButton}>{triggerButtonText}</Button>}
            <Modal>
                <Dialog>
                    <div style={{"padding": "1rem"}}>
                        <Heading level={4}>{modalTitle}</Heading>
                        {children}
                    </div>
                </Dialog>
            </Modal>
        </DialogTrigger>
    )
}
