import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Selection } from "@react-types/shared";
import type {
  AssignMode,
  Entity,
  MobileDeviceEntity,
  MobileDeviceFormValues,
  MobilePlanEntity,
  SearchOptions,
} from "@/types";
import { parseMobileDeviceFormData } from "@/utils";
import { getMobilePlanTitle } from "@/domain/mobilePlans";

interface MobileDevicePlanAssignActionsProps {
  viewedEntity: Entity | undefined;
  setViewedEntity: Dispatch<SetStateAction<Entity | undefined>>;

  draftNewMobileDevice: MobileDeviceFormValues | undefined;
  setDraftNewMobileDevice: Dispatch<
    SetStateAction<MobileDeviceFormValues | undefined>
  >;

  draftEditMobileDevice: MobileDeviceEntity | undefined;
  setDraftEditMobileDevice: Dispatch<
    SetStateAction<MobileDeviceEntity | undefined>
  >;

  isAddNewMobileDeviceModalOpen: boolean;
  openCloseAddNewMobileDeviceModal: (
    openModal: boolean,
    clearDraftEditsOnClose?: boolean,
  ) => void;
  setIsEntityModalOpen: (isOpen: boolean) => void;

  setSelectedFilterTags: Dispatch<SetStateAction<Selection>>;
  setAssignMode: (assignMode: AssignMode) => void;
  runSearch: (query?: string, options?: SearchOptions) => Promise<void>;

  addErrorAlert: (title: string, description: string) => void;
}

/**
 * Draft-and-save workflow for the one-to-one Mobile Device → Mobile Plan
 * relationship. It deliberately stays focused rather than coupling this
 * feature to the more complex Employee assignment hook.
 */
export function useMobileDevicePlanAssignActions({
  viewedEntity,
  setViewedEntity,

  draftNewMobileDevice,
  setDraftNewMobileDevice,

  draftEditMobileDevice,
  setDraftEditMobileDevice,

  isAddNewMobileDeviceModalOpen,
  openCloseAddNewMobileDeviceModal,
  setIsEntityModalOpen,

  setSelectedFilterTags,
  setAssignMode,
  runSearch,

  addErrorAlert,
}: MobileDevicePlanAssignActionsProps) {
  const getCurrentEditMobileDevice = useCallback(() => {
    if (draftEditMobileDevice) return draftEditMobileDevice;

    if (viewedEntity?.type === "mobileDevice") return viewedEntity;

    return undefined;
  }, [draftEditMobileDevice, viewedEntity]);

  const saveMobileDeviceFormData = useCallback(
    (formData: FormData) => {
      const mobileDeviceSnapshot = parseMobileDeviceFormData(formData);

      if (isAddNewMobileDeviceModalOpen) {
        setDraftNewMobileDevice(mobileDeviceSnapshot);
        openCloseAddNewMobileDeviceModal(false, false);
        return true;
      }

      const editMobileDevice = getCurrentEditMobileDevice();

      if (!editMobileDevice) {
        addErrorAlert(
          "Error: Something went wrong.",
          "Please refresh the webpage and try again.",
        );
        return false;
      }

      setDraftEditMobileDevice({
        ...editMobileDevice,
        ...mobileDeviceSnapshot,
      });
      setIsEntityModalOpen(false);
      return true;
    },
    [
      isAddNewMobileDeviceModalOpen,
      setDraftNewMobileDevice,
      openCloseAddNewMobileDeviceModal,
      getCurrentEditMobileDevice,
      addErrorAlert,
      setDraftEditMobileDevice,
      setIsEntityModalOpen,
    ],
  );

  const activateAssignMode = useCallback(
    async (mode: AssignMode, formData: FormData) => {
      if (mode !== "mobilePlan") return;

      // Store the entire form before leaving the modal. Assignment search is
      // separate from persistence, so Create/Save remains the only DB write.
      const wasSaved = saveMobileDeviceFormData(formData);
      if (!wasSaved) return;

      setAssignMode("mobilePlan");
      setSelectedFilterTags(new Set(["mobilePlan"]));
      await runSearch(undefined, { modeOverride: "mobilePlan" });
    },
    [saveMobileDeviceFormData, setAssignMode, setSelectedFilterTags, runSearch],
  );

  const cancelAssignModeHandler = useCallback(() => {
    setAssignMode("none");

    if (draftNewMobileDevice) {
      openCloseAddNewMobileDeviceModal(true);
      return;
    }

    const editMobileDevice = getCurrentEditMobileDevice();

    if (editMobileDevice) {
      setViewedEntity(editMobileDevice);
      setIsEntityModalOpen(true);
      return;
    }

    addErrorAlert(
      "Error: Something went wrong.",
      "Please refresh the webpage and try again.",
    );
  }, [
    setAssignMode,
    draftNewMobileDevice,
    openCloseAddNewMobileDeviceModal,
    getCurrentEditMobileDevice,
    setViewedEntity,
    setIsEntityModalOpen,
    addErrorAlert,
  ]);

  const assignMobilePlanClickHandler = useCallback(
    (mobilePlan: MobilePlanEntity) => {
      setAssignMode("none");

      const assignment = {
        ui_mobile_plan_id: mobilePlan.id,
        ui_mobile_plan_title: getMobilePlanTitle(mobilePlan),
      };

      if (draftNewMobileDevice) {
        setDraftNewMobileDevice({
          ...draftNewMobileDevice,
          ...assignment,
        });
        openCloseAddNewMobileDeviceModal(true);
        return;
      }

      const editMobileDevice = getCurrentEditMobileDevice();

      if (editMobileDevice) {
        const nextMobileDevice = {
          ...editMobileDevice,
          ...assignment,
        };

        setDraftEditMobileDevice(nextMobileDevice);
        setViewedEntity(nextMobileDevice);
        setIsEntityModalOpen(true);
        return;
      }

      addErrorAlert(
        "Error: Something went wrong.",
        "Please refresh the webpage and try again.",
      );
    },
    [
      setAssignMode,
      draftNewMobileDevice,
      setDraftNewMobileDevice,
      openCloseAddNewMobileDeviceModal,
      getCurrentEditMobileDevice,
      setDraftEditMobileDevice,
      setViewedEntity,
      setIsEntityModalOpen,
      addErrorAlert,
    ],
  );

  const removeMobilePlanClickHandler = useCallback(() => {
    const assignment = {
      ui_mobile_plan_id: null,
      ui_mobile_plan_title: "",
    };

    if (isAddNewMobileDeviceModalOpen) {
      setDraftNewMobileDevice((currentMobileDevice) =>
        currentMobileDevice
          ? { ...currentMobileDevice, ...assignment }
          : currentMobileDevice,
      );
      return;
    }

    const editMobileDevice = getCurrentEditMobileDevice();

    if (editMobileDevice) {
      setDraftEditMobileDevice({
        ...editMobileDevice,
        ...assignment,
      });
      return;
    }

    addErrorAlert(
      "Error: Something went wrong.",
      "Please refresh the webpage and try again.",
    );
  }, [
    isAddNewMobileDeviceModalOpen,
    setDraftNewMobileDevice,
    getCurrentEditMobileDevice,
    setDraftEditMobileDevice,
    addErrorAlert,
  ]);

  return {
    activateAssignMode,
    cancelAssignModeHandler,
    assignMobilePlanClickHandler,
    removeMobilePlanClickHandler,
  };
}
