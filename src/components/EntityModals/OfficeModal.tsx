import {OfficeEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {OfficeForm} from "@/components/EntityForms/Office/OfficeForm";
import {ENTITY_TYPE_NAME} from "@/utils";


interface OfficeModalProps {
    office: OfficeEntity

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function OfficeModal({
                                office,

                                isOpen,
                                setIsOpen,
                            }: OfficeModalProps) {
    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={setIsOpen}
                     modalTitle={ENTITY_TYPE_NAME.office}
        >
            <OfficeForm office={office}/>
        </ModalDialog>
    )
}
