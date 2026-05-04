import {MobileDeviceEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {ENTITY_TYPE_NAME} from "@/utils";
import {MobileDeviceForm} from "@/components/EntityForms/MobileDevice/MobileDeviceForm";


interface MobileDeviceModalProps {
    mobileDevice: MobileDeviceEntity

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

    onSuccess: () => void
    onError: (error: string) => void
}

export function MobileDeviceModal({
                                      mobileDevice,

                                      isOpen,
                                      setIsOpen,

                                      onSuccess,
                                      onError
                                  }: MobileDeviceModalProps) {

    const onClose = () => setIsOpen(false)

    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={setIsOpen}
                     modalTitle={`Edit ${ENTITY_TYPE_NAME.mobileDevice}`}
        >
            <MobileDeviceForm mobileDevice={mobileDevice}
                              onSuccess={onSuccess}
                              onError={onError}
                              onClose={onClose}
            >
            </MobileDeviceForm>
        </ModalDialog>
    )
}
