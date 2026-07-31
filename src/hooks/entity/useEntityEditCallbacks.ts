import { useCallback } from "react";

import { EntityType } from "@/types";

interface UseEntityEditCallbacksProps {
  entityType: EntityType;
  refreshSearchResults: () => void;
  setIsEntityModalOpen: (isOpen: boolean) => void;
  addSuccessAlert: (description: string) => void;
  addErrorAlert: (title: string, description: string) => void;
}

export function useEntityEditCallbacks({
  entityType,
  refreshSearchResults,
  setIsEntityModalOpen,
  addSuccessAlert,
  addErrorAlert,
}: UseEntityEditCallbacksProps) {
  const onEditSuccess = useCallback(() => {
    refreshSearchResults();

    setIsEntityModalOpen(false);

    switch (entityType) {
      case "employee":
        addSuccessAlert("Employee details updated.");
        break;

      case "workstation":
        addSuccessAlert("Workstation details updated.");
        break;

      case "mobileDevice":
        addSuccessAlert("Mobile Device details updated.");
        break;

      case "mobilePlan":
        addSuccessAlert("Mobile Plan details updated.");
        break;

      default:
        break;
    }
  }, [refreshSearchResults, setIsEntityModalOpen, entityType, addSuccessAlert]);

  const onEditError = useCallback(
    (error: string) => {
      setIsEntityModalOpen(false);

      switch (entityType) {
        case "employee":
          addErrorAlert("Error: Could not edit employee", error);
          break;

        case "workstation":
          addErrorAlert("Error: Could not edit workstation", error);
          break;

        case "mobileDevice":
          addErrorAlert("Error: Could not edit mobile device", error);
          break;

        case "mobilePlan":
          addErrorAlert("Error: Could not edit mobile plan", error);
          break;

        default:
          addErrorAlert("Error: Could not update record", error);
          break;
      }
    },
    [setIsEntityModalOpen, entityType, addErrorAlert],
  );

  return {
    onEditSuccess,
    onEditError,
  };
}
