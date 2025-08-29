import type {Selection} from "@react-types/shared"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {Button, Callout, Form, TextField} from "@bcgov/design-system-react-components";

import {Entity} from "@/types";

import {FilterTags} from "@/components/Search/FilterTags";
import {SearchResultsList} from "@/components/Search/SearchResultsList";


interface SearchProps {
    selectedFilterTags: Selection
    setSelectedFilterTags: (selectedFilterTags: Selection) => void
    visibleSearchResults: Entity[]
    assignMode: boolean
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
    userHasSearchedOnce: () => boolean
    searchResultsAreEmpty: boolean
    searchResultClickHandler: (item: Entity) => void
    handleSearch: (formData: FormData) => Promise<void>
}

export function Search({
                           selectedFilterTags,
                           setSelectedFilterTags,
                           visibleSearchResults,
                           assignMode,
                           assignOfficeClickHandler,
                           searchResultsAreEmpty,
                           userHasSearchedOnce,
                           searchResultClickHandler,
                           handleSearch
                       }: SearchProps) {

    const renderSearchBar = () => (
        <Form action={handleSearch} style={{margin: "1rem", display: "flex", gap: "1rem"}}>
            <TextField aria-label="Search" type="search" name="search" iconLeft={<SearchOutlinedIcon/>}/>
            <Button type="submit" variant={assignMode ? "secondary" : "primary"}>Search</Button>
        </Form>
    )

    const renderFilters = () => (
        <FilterTags selectedFilterTags={selectedFilterTags}
                    setSelectedFilterTags={setSelectedFilterTags}
                    disableFilterTags={assignMode}>
        </FilterTags>
    )

    const renderSearchResults = () => {

        {/* (Filtered) Search Results List */}
        return (
            <SearchResultsList visibleSearchResults={visibleSearchResults}
                               searchResultClickHandler={searchResultClickHandler}
                               assignMode={assignMode}
                               assignOfficeClickHandler={assignOfficeClickHandler}>
            </SearchResultsList>
        )
    }

    const showBody = userHasSearchedOnce()

    const renderResultsOrEmpty = () => {
        // Case 1: Search results are empty
        if (searchResultsAreEmpty) {
            return <p style={{padding: "1rem"}}>No results found</p>
        }

        // Case 2: Search results are not empty but filtered results are empty
        if (visibleSearchResults.length === 0) {
            return <p style={{padding: "1rem"}}>No filtered search results found</p>
        }

        // Case 3: Search results are not empty and filtered results are not empty
        return renderSearchResults()
    }

    return (
        <>
            {assignMode && (<div style={{
                margin: "1rem",
            }}>
                <Callout title="Info"
                         description="You can look up the employee's office using the search box. Once you have it, click the Assign button next to it."></Callout>
            </div>)}

            {renderSearchBar()}

            {showBody && (
                <>
                    {renderFilters()}
                    {renderResultsOrEmpty()}
                </>
            )}
        </>
    )
}
