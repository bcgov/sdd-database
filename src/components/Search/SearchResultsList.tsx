import {SearchResultItem} from "@/components/Search/SearchResultItem";
import {Entity} from "@/types/Entity";
import {getEmployeeFullName} from "@/utils";

interface SearchResultsListProps {
    searchResults: Entity[]
    searchResultClickHandler: (item: Entity) => void
    assignMode: boolean
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
}

const getSearchResultKey = (item: Entity) => {
    // Determine a unique key based on the discriminant property
    let key: string;

    if (item.type === "employee") {
        key = item.employee_id;
    } else {
        key = item.office_number;
    }

    return key
}

const getSearchResultTitle = (item: Entity) => {

    let title = "";

    if (item.type === "employee") {
        title = `${getEmployeeFullName(item)} (${item.employee_id})`
    } else {
        title = `${item.office_name} (${item.office_number})`
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
                                  assignMode={assignMode}
                                  assignOfficeClickHandler={() => assignOfficeClickHandler(item.office_number)}>
                </SearchResultItem>
            )
    )
}