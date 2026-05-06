import {SearchResultItem} from "@/components/Search/SearchResultItem";
import {AssignMode, Entity, SelectedWorkspaceAssignment} from "@/types";
import {getEmployeeFullName} from "@/utils";

interface SearchResultsListProps {
    visibleSearchResults: Entity[]
    searchResultClickHandler: (item: Entity) => void
    assignMode: AssignMode
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
    assignWorkspaceClickHandler: (assignedWorkspace: SelectedWorkspaceAssignment) => void
    assignWorkstationClickHandler: (assignedWorkstationAssetTag: string) => void
}

const getSearchResultKey = (item: Entity) => {
    // Determine a unique key based on the discriminant property
    let key: string

    switch (item.type) {
        case "employee":
            key = `employee-${item.id}`
            break
        case "office":
            key = `office-${item.office_number}`
            break
        case "workspace":
            key = `workspace-${item.office_number}-${item.workspace_number}`
            break
        case "workstation":
            key = `workstation-${item.asset_tag}`
            break
        case "mobileDevice":
            key = `mobile-device-${item.id}`
            break
    }

    return key
}

const getSearchResultTitle = (item: Entity) => {

    let title: string

    switch (item.type) {
        case "employee":
            title = item.idir
                ? `${getEmployeeFullName(item)} - ${item.idir}`
                : getEmployeeFullName(item)
            break
        case "office":
            title = `${item.office_name} - ${item.office_number}`
            break
        case "workspace":
            title = `Workspace ${item.workspace_number} - Office ${item.office_number} - ${item.category.name}`;
            break
        case "workstation":
            title = `${item.workstation_model.name} - ${item.asset_tag}`
            break
        case "mobileDevice":
            title = item.imei
                ? `${item.mobile_device_model.name} - ${item.imei}`
                : `${item.mobile_device_model.name}`
            break
    }

    return title
}

const getAssignClickHandler = (
    item: Entity,
    assignMode: AssignMode,
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void,
    assignWorkspaceClickHandler: (assignedWorkspace: SelectedWorkspaceAssignment) => void,
    assignWorkstationClickHandler: (assignedWorkstationAssetTag: string) => void,
) => {
    if (item.type === "office" && assignMode === "office") {
        return () => assignOfficeClickHandler(item.office_number)
    }

    if (item.type === "workspace" && assignMode === "workspace") {
        return () => assignWorkspaceClickHandler({
            workspace_number: item.workspace_number,
            restricted_program_area_id: item.restricted_program_area_id,
        })
    }

    if (item.type === "workstation" && assignMode === "workstation") {
        return () => assignWorkstationClickHandler(item.asset_tag)
    }

    return undefined;
}

export function SearchResultsList({
                                      visibleSearchResults,
                                      searchResultClickHandler,
                                      assignMode,
                                      assignOfficeClickHandler,
                                      assignWorkspaceClickHandler,
                                      assignWorkstationClickHandler,
                                  }: SearchResultsListProps) {
    return (
        <>
            {visibleSearchResults.map(item =>
                <SearchResultItem key={getSearchResultKey(item)}
                                  title={getSearchResultTitle(item)}
                                  searchResultClickHandler={() => searchResultClickHandler(item)}
                                  assignClickHandler={
                                      getAssignClickHandler(
                                          item,
                                          assignMode,
                                          assignOfficeClickHandler,
                                          assignWorkspaceClickHandler,
                                          assignWorkstationClickHandler
                                      )
                                  }
                >
                </SearchResultItem>
            )}
        </>
    )
}
