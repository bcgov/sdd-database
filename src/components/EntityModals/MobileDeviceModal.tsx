import {AssignMode, MobileDeviceEntity} from "@/types";
import {ModalDialog} from "@/components/ModalDialog";
import {ENTITY_TYPE_NAME} from "@/utils";
import {MobileDeviceForm} from "@/components/EntityForms/MobileDevice/MobileDeviceForm";
import {useCallback} from "react";


interface MobileDeviceModalProps {
    mobileDevice: MobileDeviceEntity
    isAssignmentPreview: boolean

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
                                      isAssignmentPreview,

                                      activateAssignMode,
                                      handleRemoveMobilePlan,
                                      clearDraftEditMobileDevice,

                                      isOpen,
                                      setIsOpen,

                                      onSuccess,
                                      onError
                                  }: MobileDeviceModalProps) {

    const onClose = useCallback(() => {
        clearDraftEditMobileDevice()
        setIsOpen(false)
    }, [clearDraftEditMobileDevice, setIsOpen])

    const handleSetIsOpen = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            onClose()
            return
        }

        setIsOpen(true)
    }, [onClose, setIsOpen])

    const handleSuccess = useCallback(() => {
        clearDraftEditMobileDevice()
        onSuccess()
    }, [clearDraftEditMobileDevice, onSuccess])

    const handleError = useCallback((error: string) => {
        clearDraftEditMobileDevice()
        onError(error)
    }, [clearDraftEditMobileDevice, onError])

    return (
        <ModalDialog isOpen={isOpen}
                     setIsOpen={handleSetIsOpen}
                     modalTitle={`Edit ${ENTITY_TYPE_NAME.mobileDevice}`}
        >
            <MobileDeviceForm mobileDevice={mobileDevice}
                              isAssignmentPreview={isAssignmentPreview}
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
