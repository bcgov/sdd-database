import {SearchResultItem} from "@/components/Search/SearchResultItem";
import {Entity} from "@/types";
import {getEmployeeFullName} from "@/utils";

interface SearchResultsListProps {
    visibleSearchResults: Entity[]
    searchResultClickHandler: (item: Entity) => void
    assignMode: boolean
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
}

const getSearchResultKey = (item: Entity) => {
    // Determine a unique key based on the discriminant property
    let key: string

    switch (item.type) {
        case "employee":
            key = `employee-${item.id}`;
            break;
        case "office":
            key = `office-${item.office_number}`;
            break;
        case "workstation":
            key = `workstation-${item.asset_tag}`;
            break;
    }

    return key
}

const getSearchResultTitle = (item: Entity) => {

    let title: string

    switch (item.type) {
        case "employee":
            title = item.idir
                ? `${getEmployeeFullName(item)} (${item.idir})`
                : getEmployeeFullName(item)
            break;
        case "office":
            title = `${item.office_name} (${item.office_number})`
            break;
        case "workstation":
            title = `Workstation (${item.asset_tag})`
            break;
    }

    return title
}

export function SearchResultsList({
                                      visibleSearchResults,
                                      searchResultClickHandler,
                                      assignMode,
                                      assignOfficeClickHandler
                                  }: SearchResultsListProps) {
    return (
        <>
            {visibleSearchResults.map(item =>
                <SearchResultItem key={getSearchResultKey(item)}
                                  title={getSearchResultTitle(item)}
                                  searchResultClickHandler={() => searchResultClickHandler(item)}
                                  assignOfficeClickHandler={
                                      item.type === "office" && assignMode ?
                                          () => assignOfficeClickHandler(item.office_number) :
                                          undefined
                                  }>
                </SearchResultItem>
            )}
        </>
    )
}
