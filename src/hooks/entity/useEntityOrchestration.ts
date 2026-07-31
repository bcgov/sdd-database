import { useEntityUIState } from "@/hooks/entity/useEntityUIState";
import { useEntityAlerts } from "@/hooks/entity/useEntityAlerts";
import { useSearch } from "@/hooks/entity/useSearch";
import { useEmployeeEditorState } from "@/hooks/employee/useEmployeeEditorState";
import { useEntitySelectionState } from "@/hooks/entity/useEntitySelectionState";
import { useEmployeeAssignActions } from "@/hooks/employee/useEmployeeAssignActions";
import { useEntityEditCallbacks } from "@/hooks/entity/useEntityEditCallbacks";
import { useWorkspaceActions } from "@/hooks/workspace/useWorkspaceActions";
import { useEntityDeleteState } from "@/hooks/entity/useEntityDeleteState";
import { useEntityCreateCallbacks } from "@/hooks/entity/useEntityCreateCallbacks";
import { useEntityCreateModalState } from "@/hooks/entity/useEntityCreateModalState";
import { useCallback } from "react";
import { deleteEmployeeAction } from "@/actions/entities/employee/actions";
import { deleteWorkstationAction } from "@/actions/entities/workstation/actions";
import { getEmployeeFullName } from "@/domain/employees";

export function useEntityOrchestration() {
  const uiState = useEntityUIState();
  const { setIsEntityModalOpen } = uiState;

  const alertsAll = useEntityAlerts();
  const { alert, setAlert, addSuccessAlert, addErrorAlert } = alertsAll;

  // Expose only what page needs from alerts
  const alerts = { alert, setAlert };

  const searchAll = useSearch();

  const {
    selectedFilterTags,
    setSelectedFilterTags,

    assignMode,
    setAssignMode,
    setAssignEmployeeOfficeNumber,
    setAssignEmployeeProgramAreaId,
    setAssignEmployeeWorkstationAssetTags,

    optimisticSearchResults,
    setOptimisticSearchResults,
    userHasSearchedOnce,
    searchResultsAreEmpty,
    handleSearch,
    runSearch,
    refreshSearchResults,
  } = searchAll;

  // Expose only what page needs from search
  const search = {
    selectedFilterTags,
    setSelectedFilterTags,
    assignMode,
    optimisticSearchResults,
    userHasSearchedOnce,
    searchResultsAreEmpty,
    handleSearch,
  };

  // employee draft/modal state
  const employeeEditorAll = useEmployeeEditorState();

  const {
    draftNewEmployee,
    setDraftNewEmployee,

    draftEditEmployee,
    setDraftEditEmployee,
    clearDraftEditEmployee,

    isAddNewEmployeeModalOpen,
    openCloseAddNewEmployeeModal,
  } = employeeEditorAll;

  const employeeEditor = {
    draftNewEmployee,
    draftEditEmployee,
    isAddNewEmployeeModalOpen,
    openCloseAddNewEmployeeModal,
  };

  // generic viewed entity state
  const selectionAll = useEntitySelectionState({
    setIsEntityModalOpen,
    clearDraftEditEmployee,
  });

  const {
    viewedEntity,
    setViewedEntity,

    openSearchResultEntityModal,
  } = selectionAll;

  // viewed entity state
  const selection = {
    viewedEntity,
    openSearchResultEntityModal,
  };

  // derive the entity type from the selected item (or fallback)
  const entityType = viewedEntity?.type ?? "employee";

  // edit success/error callbacks
  const editHandlers = useEntityEditCallbacks({
    entityType,
    refreshSearchResults,
    setIsEntityModalOpen,
    addSuccessAlert,
    addErrorAlert,
  });

  // employee assignment workflow
  const employeeAssign = useEmployeeAssignActions({
    viewedEntity,
    setViewedEntity,

    draftNewEmployee,
    setDraftNewEmployee,

    draftEditEmployee,
    setDraftEditEmployee,

    isAddNewEmployeeModalOpen,
    openCloseAddNewEmployeeModal,
    setIsEntityModalOpen,

    setSelectedFilterTags,

    setAssignMode,
    setAssignEmployeeOfficeNumber,
    setAssignEmployeeProgramAreaId,
    setAssignEmployeeWorkstationAssetTags,

    runSearch,

    addErrorAlert,
  });

  const closeEmployeeCreateModal = useCallback(() => {
    openCloseAddNewEmployeeModal(false);
  }, [openCloseAddNewEmployeeModal]);

  const closeEmployeeCreateModalOnError = useCallback(() => {
    openCloseAddNewEmployeeModal(false, false);
  }, [openCloseAddNewEmployeeModal]);

  // add employee success/error callbacks
  const employeeCreateHandlers = useEntityCreateCallbacks({
    entityType: "employee",

    refreshSearchResults,

    closeCreateModal: closeEmployeeCreateModal,
    closeCreateModalOnError: closeEmployeeCreateModalOnError,

    addSuccessAlert,
    addErrorAlert,
  });

  const deletableViewedEntity =
    viewedEntity?.type === "employee" || viewedEntity?.type === "workstation"
      ? viewedEntity
      : undefined;

  const deleteEntity = useCallback(
    async (
      entity: typeof deletableViewedEntity extends undefined
        ? never
        : NonNullable<typeof deletableViewedEntity>,
    ) => {
      if (entity.type === "employee") {
        return deleteEmployeeAction(entity.id);
      }

      return deleteWorkstationAction(entity.asset_tag);
    },
    [],
  );

  const getEntityName = useCallback(
    (entity: NonNullable<typeof deletableViewedEntity>) => {
      return entity.type === "employee"
        ? getEmployeeFullName(entity)
        : entity.asset_tag;
    },
    [],
  );

  const entityDelete = useEntityDeleteState({
    viewedEntity: deletableViewedEntity,

    setIsEntityModalOpen,

    setOptimisticSearchResults,
    refreshSearchResults,

    addSuccessAlert,
    addErrorAlert,

    deleteEntity,
    getEntityName,
  });

  // workspace hold/unhold
  const workspaceActions = useWorkspaceActions({
    viewedEntity,
    setViewedEntity,

    refreshSearchResults,

    addSuccessAlert,
    addErrorAlert,
  });

  // workstation add modal state
  const workstationCreate = useEntityCreateModalState();
  const { openCloseCreateModal: openCloseWorkstationCreateModal } =
    workstationCreate;

  const closeWorkstationCreateModal = useCallback(() => {
    openCloseWorkstationCreateModal(false);
  }, [openCloseWorkstationCreateModal]);

  // add workstation success/error callbacks
  const workstationCreateHandlers = useEntityCreateCallbacks({
    entityType: "workstation",

    refreshSearchResults,

    closeCreateModal: closeWorkstationCreateModal,

    addSuccessAlert,
    addErrorAlert,
  });

  // mobile device add modal state
  const mobileDeviceCreate = useEntityCreateModalState();
  const { openCloseCreateModal: openCloseMobileDeviceCreateModal } =
    mobileDeviceCreate;

  const closeMobileDeviceCreateModal = useCallback(() => {
    openCloseMobileDeviceCreateModal(false);
  }, [openCloseMobileDeviceCreateModal]);

  // add mobile device success/error callbacks
  const mobileDeviceCreateHandlers = useEntityCreateCallbacks({
    entityType: "mobileDevice",

    refreshSearchResults,

    closeCreateModal: closeMobileDeviceCreateModal,

    addSuccessAlert,
    addErrorAlert,
  });

  // mobile plan add modal state
  const mobilePlanCreate = useEntityCreateModalState();
  const { openCloseCreateModal: openCloseMobilePlanCreateModal } =
    mobilePlanCreate;

  const closeMobilePlanCreateModal = useCallback(() => {
    openCloseMobilePlanCreateModal(false);
  }, [openCloseMobilePlanCreateModal]);

  // add mobile plan success/error callbacks
  const mobilePlanCreateHandlers = useEntityCreateCallbacks({
    entityType: "mobilePlan",

    refreshSearchResults,

    closeCreateModal: closeMobilePlanCreateModal,

    addSuccessAlert,
    addErrorAlert,
  });

  return {
    selection,
    uiState,

    search,

    editHandlers,

    employeeEditor,
    employeeAssign,
    employeeCreateHandlers,
    entityDelete,

    workspaceActions,

    workstationCreate,
    workstationCreateHandlers,

    mobileDeviceCreate,
    mobileDeviceCreateHandlers,

    mobilePlanCreate,
    mobilePlanCreateHandlers,

    alerts,
  };
}
