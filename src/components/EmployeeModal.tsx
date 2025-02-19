import {Button, Dialog, DialogTrigger, Heading, Modal} from "@bcgov/design-system-react-components";

interface EmployeeModalProps {
    isOpen: boolean;    // state passed from parent
    onOpenChange: (isOpen: boolean) => void;    // function to update state
    triggerButtonText?: string;
    modalTitle: string;
    children: React.ReactNode;
}

export function EmployeeModal({isOpen, onOpenChange, triggerButtonText, modalTitle, children}: EmployeeModalProps) {
    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
            {triggerButtonText && <Button variant="secondary">{triggerButtonText}</Button>}
            <Modal>
                <Dialog>
                    <div style={{padding: "1rem"}}>
                        <Heading level={4}>{modalTitle}</Heading>
                        {children}
                    </div>
                </Dialog>
            </Modal>
        </DialogTrigger>
    )
}