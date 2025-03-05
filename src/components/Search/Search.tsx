import type {Selection} from "@react-types/shared"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {Entity} from "@/types/Entity";

import {Button, Form, TextField} from "@bcgov/design-system-react-components";

import {SearchResult} from "@/components/Search/SearchResult";
import {FilterTags} from "@/components/Search/FilterTags";


interface SearchProps {
    searchResults: Entity[];
    selectedFilterTags: Selection;
    setSelectedFilterTags: (selectedFilterTags: Selection) => void;
    userHasSearchedOnce: () => boolean;
    searchResultClickHandler: (item: Entity) => void;
    handleSearch: (formData: FormData) => Promise<void>;
}

export function Search({
                           searchResults,
                           selectedFilterTags,
                           setSelectedFilterTags,
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

    const searchResultsList = () => {
        return (
            <>
                {
                    filteredSearchResults.map(item =>
                        <SearchResult key={getSearchResultKey(item)}
                                      item={item}
                                      searchResultClickHandler={searchResultClickHandler}>
                        </SearchResult>
                    )
                }
            </>
        )
    }

    return (
        <>
            {/* Search Bar */}
            <Form action={handleSearch}>
                <TextField type="search" name="search" iconLeft=<SearchOutlinedIcon/>/>
                <Button type="submit">Search</Button>
            </Form>

            {userHasSearchedOnce() ? (
                searchResults.length === 0 ? (
                    <p> No results found</p>
                ) : (
                    <>
                        {/* Search Filters */}
                        <FilterTags setSelectedFilterTags={setSelectedFilterTags}></FilterTags>

                        {filteredSearchResults.length === 0 ? (
                            <p> No filtered search results found</p>
                        ) : (
                            searchResultsList()
                        )}
                    </>
                )
            ) : null}
        </>
    )
}
