import {useEntityUIState} from "@/hooks/entity/useEntityUIState";
import {useEntityAlerts} from "@/hooks/entity/useEntityAlerts";
import {useSearch} from "@/hooks/entity/useSearch";
import {useEmployeeEditorState} from "@/hooks/employee/useEmployeeEditorState";
import {useEntitySelectionState} from "@/hooks/entity/useEntitySelectionState";
import {useEmployeeAssignActions} from "@/hooks/employee/useEmployeeAssignActions";
import {useEmployeeCreateCallbacks} from "@/hooks/employee/useEmployeeCreateCallbacks";
import {useEntityEditCallbacks} from "@/hooks/entity/useEntityEditCallbacks";
import {useWorkspaceActions} from "@/hooks/workspace/useWorkspaceActions";
import {useWorkstationCreateState} from "@/hooks/workstation/useWorkstationCreateState";
import {useWorkstationCreateCallbacks} from "@/hooks/workstation/useWorkstationCreateCallbacks";
import {useEmployeeDeleteState} from "@/hooks/employee/useEmployeeDeleteState";


export function useEntityOrchestration() {

    const uiState = useEntityUIState()
    const {setIsEditModalOpen} = uiState

    const alertsAll = useEntityAlerts()
    const {alert, setAlert, addSuccessAlert, addErrorAlert} = alertsAll

    // Expose only what page needs from alerts
    const alerts = {alert, setAlert}

    const searchAll = useSearch()

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
    } = searchAll

    // Expose only what page needs from search
    const search = {
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        optimisticSearchResults,
        userHasSearchedOnce,
        searchResultsAreEmpty,
        handleSearch
    }

    // employee draft/modal state
    const employeeEditorAll = useEmployeeEditorState()

    const {
        draftNewEmployee,
        setDraftNewEmployee,

        draftEditEmployee,
        setDraftEditEmployee,
        clearDraftEditEmployee,

        isAddNewEmployeeModalOpen,
        openCloseAddNewEmployeeModal,
    } = employeeEditorAll

    const employeeEditor = {
        draftNewEmployee,
        draftEditEmployee,
        isAddNewEmployeeModalOpen,
        openCloseAddNewEmployeeModal
    }

    // generic viewed entity state
    const selectionAll = useEntitySelectionState({
        setIsEditModalOpen,
        clearDraftEditEmployee
    })

    const {
        viewedEntity,
        setViewedEntity,

        openSearchResultEditModal
    } = selectionAll

    // viewed entity state
    const selection = {
        viewedEntity,
        openSearchResultEditModal,
    }

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
        setIsEditModalOpen,

        setSelectedFilterTags,

        setAssignMode,
        setAssignEmployeeOfficeNumber,
        setAssignEmployeeProgramAreaId,
        setAssignEmployeeWorkstationAssetTags,

        runSearch,

        addErrorAlert
    })

    // add employee success/error callbacks
    const employeeCreateHandlers = useEmployeeCreateCallbacks({
        refreshSearchResults,

        openCloseAddNewEmployeeModal,

        addSuccessAlert,
        addErrorAlert
    })

    // derive the entity type from the selected item (or fallback)
    const entityType = viewedEntity?.type ?? "employee";

    // edit success/error callbacks
    const editHandlers = useEntityEditCallbacks({
        entityType,
        refreshSearchResults,
        setIsEditModalOpen,
        addSuccessAlert,
        addErrorAlert
    })

    // workspace hold/unhold
    const workspaceActions = useWorkspaceActions({
        viewedEntity,
        setViewedEntity,

        refreshSearchResults,

        addSuccessAlert,
        addErrorAlert
    })

    // workstation add modal state
    const workstationCreate = useWorkstationCreateState()
    const {openCloseAddNewWorkstationModal} = workstationCreate

    // add workstation success/error callbacks
    const workstationCreateHandlers = useWorkstationCreateCallbacks({
        refreshSearchResults,

        openCloseAddNewWorkstationModal,

        addSuccessAlert,
        addErrorAlert
    })

    // employee delete state/action
    const employeeDelete = useEmployeeDeleteState({
        viewedEntity,

        setIsEditModalOpen,

        setOptimisticSearchResults,
        refreshSearchResults,

        addSuccessAlert,
        addErrorAlert
    })

    return {
        selection,
        uiState,

        search,

        editHandlers,

        employeeEditor,
        employeeAssign,
        employeeCreateHandlers,
        employeeDelete,

        workspaceActions,

        workstationCreate,
        workstationCreateHandlers,

        alerts
    }
}
