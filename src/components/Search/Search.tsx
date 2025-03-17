import type {Selection} from "@react-types/shared"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {Button, Form, TextField} from "@bcgov/design-system-react-components";

import {Entity} from "@/types/Entity";

import {SearchResult} from "@/components/Search/SearchResult";
import {FilterTags} from "@/components/Search/FilterTags";


interface SearchProps {
    searchResults: Entity[];
    selectedFilterTags: Selection;
    setSelectedFilterTags: (selectedFilterTags: Selection) => void;
    assignMode: boolean;
    userHasSearchedOnce: () => boolean;
    searchResultClickHandler: (item: Entity) => void;
    handleSearch: (formData: FormData) => Promise<void>;
}

export function Search({
                           searchResults,
                           selectedFilterTags,
                           setSelectedFilterTags,
                           assignMode,
                           userHasSearchedOnce,
                           searchResultClickHandler,
                           handleSearch
                       }: SearchProps) {

    const filteredSearchResults = searchResults.filter((item) => {

        if (selectedFilterTags === "all") return true;

        if (selectedFilterTags.size === 0) return true;

        return selectedFilterTags.has(item.type)
    })

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

    const displaySearchResults = () => {
        return (
            <>
                {
                    filteredSearchResults.map(item =>
                        <SearchResult key={getSearchResultKey(item)}
                                      item={item}
                                      searchResultClickHandler={searchResultClickHandler}
                                      assignMode={assignMode}>
                        </SearchResult>
                    )
                }
            </>
        )
    }

    const displayFiltersAndSearchResults = () => {
        return (
            <>
                {/* Search Filters */}
                <FilterTags selectedFilterTags={selectedFilterTags}
                            setSelectedFilterTags={setSelectedFilterTags}
                            disableFilterTags={assignMode}></FilterTags>

                {/* Search Results */}
                {
                    filteredSearchResults.length === 0 ?
                        <p style={{padding: "1rem"}}>No filtered search results found</p> :
                        displaySearchResults()
                }
            </>
        )
    }

    const displaySearchBody = () => {

        if (searchResults.length === 0) {

            return userHasSearchedOnce() ? <p style={{padding: "1rem"}}>No results found</p> : null

        } else {
            return displayFiltersAndSearchResults()
        }
    }

    return (
        <>
            {/* Search Bar */}
            <Form action={handleSearch}>
                <TextField aria-label="Search" type="search" name="search" iconLeft={<SearchOutlinedIcon/>}/>
                <Button type="submit" variant={assignMode ? "secondary" : "primary"}>Search</Button>
            </Form>

            {displaySearchBody()}
        </>
    )
}
