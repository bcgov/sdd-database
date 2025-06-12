import {SearchResultItem} from "@/components/Search/SearchResultItem";
import {Entity} from "@/types";
import {getEmployeeFullName} from "@/utils";

interface SearchResultsListProps {
    searchResults: Entity[]
    searchResultClickHandler: (item: Entity) => void
    assignMode: boolean
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
}

const getSearchResultKey = (item: Entity) => {
    // Determine a unique key based on the discriminant property
    let key: string

    switch (item.type) {
        case "employee":
            key = item.employee_id;
            break;
        case "office":
            key = item.office_number;
            break;
        case "workstation":
            key = item.asset_tag;
            break;
    }

    return key
}

const getSearchResultTitle = (item: Entity) => {

    let title: string

    switch (item.type) {
        case "employee":
            title = `${getEmployeeFullName(item)} (${item.employee_id})`
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
                                      searchResults,
                                      searchResultClickHandler,
                                      assignMode,
                                      assignOfficeClickHandler
                                  }: SearchResultsListProps) {
    return (
        searchResults.length === 0 ?

            <p style={{padding: "1rem"}}>No filtered search results found</p> :

            searchResults.map(item =>
                <SearchResultItem key={getSearchResultKey(item)}
                                  title={getSearchResultTitle(item)}
                                  searchResultClickHandler={() => searchResultClickHandler(item)}
                                  assignOfficeClickHandler={
                                      item.type === "office" && assignMode ?
                                          () => assignOfficeClickHandler(item.office_number) :
                                          undefined
                                  }>
                </SearchResultItem>
            )
    )
}
