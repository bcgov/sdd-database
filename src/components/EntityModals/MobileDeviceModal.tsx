import {AssignMode, MobileDeviceEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {ENTITY_TYPE_NAME} from "@/utils";
import {MobileDeviceForm} from "@/components/EntityForms/MobileDevice/MobileDeviceForm";


interface MobileDeviceModalProps {
    mobileDevice: MobileDeviceEntity

    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>
    handleRemoveMobilePlan: () => void
    clearDraftEditMobileDevice: () => void

    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

    onSuccess: () => void
    onError: (error: string) => void
}

export function MobileDeviceModal({
                                      mobileDevice,

                                      activateAssignMode,
                                      handleRemoveMobilePlan,
                                      clearDraftEditMobileDevice,

                                      isOpen,
                                      setIsOpen,

                                      onSuccess,
                                      onError
                                  }: MobileDeviceModalProps) {

    const onClose = () => {
        clearDraftEditMobileDevice()
        setIsOpen(false)
    }

    const handleSetIsOpen = (isOpen: boolean) => {
        if (!isOpen) {
            onClose()
            return
        }

        setIsOpen(true)
    }

    const handleSuccess = () => {
        clearDraftEditMobileDevice()
        onSuccess()
    }

    const handleError = (error: string) => {
        clearDraftEditMobileDevice()
        onError(error)
    }

    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={handleSetIsOpen}
                     modalTitle={`Edit ${ENTITY_TYPE_NAME.mobileDevice}`}
        >
            <MobileDeviceForm mobileDevice={mobileDevice}
                              activateAssignMode={activateAssignMode}
                              handleRemoveMobilePlan={handleRemoveMobilePlan}
                              onSuccess={handleSuccess}
                              onError={handleError}
                              onClose={onClose}
            >
            </MobileDeviceForm>
        </ModalDialog>
    )
}
