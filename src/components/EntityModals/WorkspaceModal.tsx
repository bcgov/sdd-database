import {WorkspaceEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {WorkspaceForm} from "@/components/EntityForms/Workspace/WorkspaceForm";
import {ENTITY_TYPE_NAME} from "@/utils";


interface WorkspaceModalProps {
    workspace: WorkspaceEntity

    onHold: () => void
    onRemoveHold: () => void

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    
    onSuccess: () => void
    onError: (error: string) => void
}

export function WorkspaceModal({
                                   workspace,

                                   onHold,
                                   onRemoveHold,

                                   isOpen,
                                   setIsOpen,                                     
                                   onSuccess,
                                   onError,
                               }: WorkspaceModalProps) {

    const onClose = () => setIsOpen(false)
    
    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={setIsOpen}
                     modalTitle={ENTITY_TYPE_NAME.workspace}
        >
            <WorkspaceForm workspace={workspace}
                           onHold={onHold}
                           onRemoveHold={onRemoveHold}
                           onSuccess={onSuccess}
                           onError={onError}
                           onClose={onClose}
            >
            </WorkspaceForm>
        </ModalDialog>
    )
}
