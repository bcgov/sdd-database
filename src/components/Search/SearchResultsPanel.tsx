import {AssignMode, Entity, MobileDeviceEntity, SelectedWorkspaceAssignment} from "@/types";
import {SearchResultsList} from "@/components/Search/SearchResultsList";


interface SearchResultsPanelProps {
    visibleSearchResults: Entity[]
    searchResultsAreEmpty: boolean
    userHasSearchedOnce: () => boolean
    searchResultClickHandler: (item: Entity) => void

    assignMode: AssignMode
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
    assignWorkspaceClickHandler: (assignedWorkspace: SelectedWorkspaceAssignment) => void
    assignWorkstationClickHandler: (assignedWorkstationAssetTag: string) => void
    assignMobileDeviceClickHandler: (assignedMobileDevice: MobileDeviceEntity) => void
}

export function SearchResultsPanel({
                                       visibleSearchResults,
                                       searchResultsAreEmpty,
                                       userHasSearchedOnce,
                                       searchResultClickHandler,

                                       assignMode,
                                       assignOfficeClickHandler,
                                       assignWorkspaceClickHandler,
                                       assignWorkstationClickHandler,
                                       assignMobileDeviceClickHandler
                                   }: SearchResultsPanelProps) {
    const showBody = userHasSearchedOnce() || assignMode !== "none"

    if (!showBody) {
        return null
    }

    // Case 1: Search results are empty
    if (searchResultsAreEmpty) {
        return <p style={{padding: "1rem"}}>No results found</p>
    }

    // Case 2: Search results are not empty but filtered results are empty
    if (visibleSearchResults.length === 0) {
        return <p style={{padding: "1rem"}}>No filtered search results found</p>
    }

    // Case 3: Search results are not empty and filtered results are not empty
    // (Filtered) Search Results List
    return (
        <SearchResultsList visibleSearchResults={visibleSearchResults}
                           searchResultClickHandler={searchResultClickHandler}

                           assignMode={assignMode}
                           assignOfficeClickHandler={assignOfficeClickHandler}
                           assignWorkspaceClickHandler={assignWorkspaceClickHandler}
                           assignWorkstationClickHandler={assignWorkstationClickHandler}
                           assignMobileDeviceClickHandler={assignMobileDeviceClickHandler}
        >
        </SearchResultsList>
    )
}
