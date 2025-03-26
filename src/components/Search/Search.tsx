import type {Selection} from "@react-types/shared"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {Button, Form, TextField} from "@bcgov/design-system-react-components";

import {Entity} from "@/types/Entity";

import {FilterTags} from "@/components/Search/FilterTags";
import {SearchResultsList} from "@/components/Search/SearchResultsList";


interface SearchProps {
    searchResults: Entity[]
    selectedFilterTags: Selection
    setSelectedFilterTags: (selectedFilterTags: Selection) => void
    assignMode: boolean
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
    userHasSearchedOnce: () => boolean
    searchResultClickHandler: (item: Entity) => void
    handleSearch: (formData: FormData) => Promise<void>
}

export function Search({
                           searchResults,
                           selectedFilterTags,
                           setSelectedFilterTags,
                           assignMode,
                           assignOfficeClickHandler,
                           userHasSearchedOnce,
                           searchResultClickHandler,
                           handleSearch
                       }: SearchProps) {

    const filteredSearchResults = searchResults.filter((item) => {

        if (selectedFilterTags === "all") return true;

        if (selectedFilterTags.size === 0) return true;

        return selectedFilterTags.has(item.type)
    })

    const displayFiltersAndSearchResults = () => {
        return (
            <>
                {/* Search Filters */}
                <FilterTags selectedFilterTags={selectedFilterTags}
                            setSelectedFilterTags={setSelectedFilterTags}
                            disableFilterTags={assignMode}></FilterTags>

                {/* (Filtered) Search Results List */}
                <SearchResultsList searchResults={filteredSearchResults}
                                   searchResultClickHandler={searchResultClickHandler}
                                   assignMode={assignMode}
                                   assignOfficeClickHandler={assignOfficeClickHandler}>
                </SearchResultsList>
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
            <Form action={handleSearch} style={{margin: "1rem", display: "flex", gap: "1rem"}}>
                <TextField aria-label="Search" type="search" name="search" iconLeft={<SearchOutlinedIcon/>}/>
                <Button type="submit" variant={assignMode ? "secondary" : "primary"}>Search</Button>
            </Form>

            {displaySearchBody()}
        </>
    )
}
