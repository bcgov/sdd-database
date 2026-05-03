import {AssignMode, EmployeeEntity, Entity} from "@/types";
import {EmployeeModal} from "@/components/Entity_Modals/EmployeeModal";
import {OfficeModal} from "@/components/Entity_Modals/OfficeModal";
import {WorkspaceModal} from "@/components/Entity_Modals/WorkspaceModal";
import {WorkstationModal} from "@/components/Entity_Modals/WorkstationModal";


interface EntityModalProps {
    viewedEntity: Entity
    draftEditEmployee?: EmployeeEntity

    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>

    handleRemoveWorkspace: () => void
    handleRemoveWorkstation: (assetTag: string) => void

    handleHoldWorkspace: () => void
    handleRemoveWorkspaceHold: () => void

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

    onSuccess: () => void
    onError: (error: string) => void
    onDelete: () => void
}

export function EntityModal({
                                viewedEntity,
                                draftEditEmployee,

                                activateAssignMode,

                                handleRemoveWorkspace,
                                handleRemoveWorkstation,

                                handleHoldWorkspace,
                                handleRemoveWorkspaceHold,

                                isOpen,
                                setIsOpen,

                                onSuccess,
                                onError,
                                onDelete,
                            }: EntityModalProps) {

    switch (viewedEntity.type) {
        case "employee":
            return (
                <EmployeeModal employee={draftEditEmployee ?? viewedEntity}
                               activateAssignMode={activateAssignMode}
                               handleRemoveWorkspace={handleRemoveWorkspace}
                               handleRemoveWorkstation={handleRemoveWorkstation}
                               isOpen={isOpen}
                               setIsOpen={setIsOpen}
                               onSuccess={onSuccess}
                               onError={onError}
                               onDelete={onDelete}
                >
                </EmployeeModal>
            )

        case "office":
            return (
                <OfficeModal office={viewedEntity}
                             isOpen={isOpen}
                             setIsOpen={setIsOpen}
                >
                </OfficeModal>
            )

        case "workspace":
            return (
                <WorkspaceModal workspace={viewedEntity}
                                onHold={handleHoldWorkspace}
                                onRemoveHold={handleRemoveWorkspaceHold}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                >
                </WorkspaceModal>
            )
        case "workstation":
            return (
                <WorkstationModal workstation={viewedEntity}
                                  isOpen={isOpen}
                                  setIsOpen={setIsOpen}
                                  onSuccess={onSuccess}
                                  onError={onError}
                >
                </WorkstationModal>
            )
    }
}
