import {useCallback, useState} from "react";
import type {Selection} from "@react-types/shared";

import {Entity} from "@/types";

import {searchOfficesAction} from "@/actions/offices";
import {searchAllAction} from "@/actions/search";

export function useSearch(assignMode: boolean) {

    const [searchPhrase, setSearchPhrase] = useState<string>();
    const [selectedFilterTags, setSelectedFilterTags] = useState<Selection>(new Set<string>());
    const [searchResults, setSearchResults] = useState<Entity[]>([]);

    const userHasSearchedOnce = () => searchPhrase !== undefined;

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
        searchResults,
        userHasSearchedOnce,
        handleSearch,
        runSearch,
        refreshSearchResults
    }
}
