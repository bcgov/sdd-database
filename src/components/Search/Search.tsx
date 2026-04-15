import type {Selection} from "@react-types/shared"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {Button, Callout, Form, TextField} from "@bcgov/design-system-react-components";

import {AssignMode, Entity, SelectedWorkspaceAssignment} from "@/types";

import {FilterTags} from "@/components/Search/FilterTags";
import {SearchResultsList} from "@/components/Search/SearchResultsList";


interface SearchProps {
    selectedFilterTags: Selection
    setSelectedFilterTags: (selectedFilterTags: Selection) => void

    visibleSearchResults: Entity[]

    assignMode: AssignMode
    cancelAssignModeHandler: () => void
    assignOfficeClickHandler: (assignedOfficeNumber: string) => void
    assignWorkspaceClickHandler: (assignedWorkspace: SelectedWorkspaceAssignment) => void
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
                           cancelAssignModeHandler,
                           assignOfficeClickHandler,
                           assignWorkspaceClickHandler,
                           searchResultsAreEmpty,
                           userHasSearchedOnce,
                           searchResultClickHandler,
                           handleSearch
                       }: SearchProps) {

    const getAssignModeCallout = () => {
        switch (assignMode) {
            case "office":
                return {
                    title: "Available Offices",
                    description: "Use the search box to find the employee's office, then click Assign next to the correct result"
                }
            case "workspace":
                return {
                    title: "Eligible Empty Workspaces in Employee's Office",
                    description: "Use the search box to find a workspace in the selected office, then click Assign next to the correct result"
                }
            default:
                return null
        }
    }

    const assignModeCallout = getAssignModeCallout()

    const renderSearchBar = () => (
        <Form action={handleSearch} style={{margin: "1rem", display: "flex", gap: "1rem"}}>
            <TextField aria-label="Search"
                       type="search"
                       name="search"
                       iconLeft={<SearchOutlinedIcon/>}>
            </TextField>
            <Button type="submit" size="large" variant={assignMode !== "none" ? "secondary" : "primary"}>Search</Button>
        </Form>
    )

    const renderFilters = () => (
        <FilterTags selectedFilterTags={selectedFilterTags}
                    setSelectedFilterTags={setSelectedFilterTags}
                    disableFilterTags={assignMode !== "none"}>
        </FilterTags>
    )

    const renderSearchResults = () => {

        // (Filtered) Search Results List
        return (
            <SearchResultsList visibleSearchResults={visibleSearchResults}
                               searchResultClickHandler={searchResultClickHandler}
                               assignMode={assignMode}
                               assignOfficeClickHandler={assignOfficeClickHandler}
                               assignWorkspaceClickHandler={assignWorkspaceClickHandler}>
            </SearchResultsList>
        )
    }

    const showBody = userHasSearchedOnce() || assignMode !== "none"

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
            {
                assignModeCallout && (
                    <div style={{
                        margin: "1rem",
                    }}>
                        <Callout title={assignModeCallout.title}
                                 description={assignModeCallout.description}>

                        </Callout>
                    </div>
                )
            }

            {renderSearchBar()}

            {showBody && (
                <>
                    {renderFilters()}
                    {renderResultsOrEmpty()}
                </>
            )}

            {assignMode !== "none" &&
                <Button size="large"
                        variant={searchResultsAreEmpty ? "primary" : "secondary"}
                        onPress={cancelAssignModeHandler}
                        style={{margin: "1rem"}}>
                    Go Back
                </Button>}
        </>
    )
}
