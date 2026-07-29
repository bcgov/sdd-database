import {MobilePlanEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {MobilePlanForm} from "@/components/EntityForms/MobilePlan/MobilePlanForm";
import {ENTITY_TYPE_NAME} from "@/utils";


interface MobilePlanModalProps {
    mobilePlan: MobilePlanEntity

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function MobilePlanModal({
                                    mobilePlan,

                                    isOpen,
                                    setIsOpen,
                                }: MobilePlanModalProps) {
    return (
        <ModalDialog isOpen={isOpen} setIsOpen={setIsOpen} modalTitle={ENTITY_TYPE_NAME.mobilePlan}>
            <MobilePlanForm mobilePlan={mobilePlan}/>
        </ModalDialog>
    )
}
