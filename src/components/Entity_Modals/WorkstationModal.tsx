import {ModalDialog} from "@/components/ModalDialog";
import {WorkstationForm} from "@/components/Entity_Forms/Workstation/WorkstationForm";
import {WorkstationEntity} from "@/types";
import {ENTITY_TYPE_NAME} from "@/utils";


interface WorkstationModalProps {
    workstation: WorkstationEntity

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function WorkstationModal({
                                     workstation,

                                     isOpen,
                                     setIsOpen,
                                 }: WorkstationModalProps) {
    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={setIsOpen}
                     modalTitle={ENTITY_TYPE_NAME.workstation}
        >
            <WorkstationForm workstation={workstation}/>
        </ModalDialog>
    )
}
