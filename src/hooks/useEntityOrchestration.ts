import {useEntityEditCallbacks} from "@/hooks/useEntityEditCallbacks";
import {useSearch} from "@/hooks/useSearch";
import {useEntityUIState} from "@/hooks/useEntityUIState";
import {useEntityAlerts} from "@/hooks/useEntityAlerts";
import {useEntityActions} from "@/hooks/useEntityActions";


export function useEntityOrchestration() {

    const uiState = useEntityUIState()
    const {setIsEditModalOpen} = uiState;

    const alertsAll = useEntityAlerts()
    const {alert, setAlert, addSuccessAlert, addErrorAlert} = alertsAll;

    // Expose only what page needs from alerts
    const alerts = {alert, setAlert};

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
    } = searchAll;

    // Expose only what page needs from search
    const search = {
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        optimisticSearchResults,
        userHasSearchedOnce,
        searchResultsAreEmpty,
        handleSearch
    };

    const actions = useEntityActions({
        setIsEditModalOpen,

        addSuccessAlert,
        addErrorAlert,

        setSelectedFilterTags,

        setAssignMode,
        setAssignEmployeeOfficeNumber,
        setAssignEmployeeProgramAreaId,
        setAssignEmployeeWorkstationAssetTags,

        setOptimisticSearchResults,
        runSearch,
        refreshSearchResults
    })

    // derive the entity type from the selected item (or fallback)
    const entityType = actions.viewedEntity?.type ?? "employee";

    const editHandlers = useEntityEditCallbacks({
        entityType,
        refreshSearchResults,
        setIsEditModalOpen,
        addSuccessAlert,
        addErrorAlert
    })

    return {
        uiState,
        alerts,
        search,
        actions,
        editHandlers
    }
}
