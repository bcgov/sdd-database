import { useCallback, useState } from "react";
import type { MobileDeviceEntity, MobileDeviceFormValues } from "@/types";

export function useMobileDeviceEditorState() {
  const [draftNewMobileDevice, setDraftNewMobileDevice] =
    useState<MobileDeviceFormValues>();

  // The persisted entity plus any unsaved form values while assignment search
  // temporarily closes the edit modal.
  const [draftEditMobileDevice, setDraftEditMobileDevice] =
    useState<MobileDeviceEntity>();

  const [isAddNewMobileDeviceModalOpen, setIsAddNewMobileDeviceModalOpen] =
    useState(false);

  const clearDraftEditMobileDevice = useCallback(() => {
    setDraftEditMobileDevice(undefined);
  }, []);

  const openCloseAddNewMobileDeviceModal = useCallback(
    (openModal: boolean, clearDraftEditsOnClose: boolean = true) => {
      setIsAddNewMobileDeviceModalOpen(openModal);

      if (!openModal && clearDraftEditsOnClose) {
        setDraftNewMobileDevice(undefined);
      }
    },
    [],
  );

  return {
    draftNewMobileDevice,
    setDraftNewMobileDevice,

    draftEditMobileDevice,
    setDraftEditMobileDevice,
    clearDraftEditMobileDevice,

    isAddNewMobileDeviceModalOpen,
    openCloseAddNewMobileDeviceModal,
  };
}
