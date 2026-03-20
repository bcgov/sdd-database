import {useCallback, useOptimistic, useState} from "react";
import type {Selection} from "@react-types/shared";

import {Entity} from "@/types";

import {searchOfficesAction} from "@/actions/offices";
import {searchAllAction} from "@/actions/search";


export function useSearch() {

    const [searchPhrase, setSearchPhrase] = useState<string>();
    const [selectedFilterTags, setSelectedFilterTags] = useState<Selection>(new Set<string>());
    const [searchResults, setSearchResults] = useState<Entity[]>([]);

    const [assignMode, setAssignMode] = useState(false);

    const filteredSearchResults = searchResults.filter((item) => {

        if (selectedFilterTags === "all") return true;

        if (selectedFilterTags.size === 0) return true;

        return selectedFilterTags.has(item.type)
    })

    // A reducer function used for optimistic deletes.
    const excludeEmployeeReducer = (filteredSearchResults: Entity[], id: number) => filteredSearchResults.filter(
        item =>
            // keep every non-employee item
            item.type !== "employee" ||
            // ...or keep an employee whose ID does not match the one we're deleting
            item.id !== id
    )

    const [optimisticSearchResults, setOptimisticSearchResults] = useOptimistic(filteredSearchResults, excludeEmployeeReducer);

    const userHasSearchedOnce = () => searchPhrase !== undefined;

    const searchResultsAreEmpty = searchResults.length === 0

    const handleSearch = async (formData: FormData) => {
        const query = formData.get("search") as string;
        setSearchPhrase(query);

        await runSearch(query);
    }

    const runSearch = useCallback(async (query?: string, searchOnlyOffices?: boolean) => {

        let results: Entity[] = [];

        if (searchOnlyOffices || assignMode) {
            results = await searchOfficesAction(query);
        } else {
            results = await searchAllAction(query);
        }

        setSearchResults(results);
    }, [assignMode])

    const refreshSearchResults = useCallback(() => runSearch(searchPhrase), [runSearch, searchPhrase])

    return {
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        setAssignMode,
        optimisticSearchResults,
        setOptimisticSearchResults,
        userHasSearchedOnce,
        searchResultsAreEmpty,
        handleSearch,
        runSearch,
        refreshSearchResults
    }
}
