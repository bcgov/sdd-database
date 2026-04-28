import {WorkspaceEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {WorkspaceForm} from "@/components/Entity_Forms/Workspace/WorkspaceForm";
import {ENTITY_TYPE_NAME} from "@/utils";


interface WorkspaceModalProps {
    workspace: WorkspaceEntity

    onHold: () => void
    onRemoveHold: () => void

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function WorkspaceModal({
                                   workspace,

                                   onHold,
                                   onRemoveHold,

                                   isOpen,
                                   setIsOpen,
                               }: WorkspaceModalProps) {
    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={setIsOpen}
                     modalTitle={ENTITY_TYPE_NAME.workspace}
        >
            <WorkspaceForm workspace={workspace}
                           onHold={onHold}
                           onRemoveHold={onRemoveHold}
            >
            </WorkspaceForm>
        </ModalDialog>
    )
}
