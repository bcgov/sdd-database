import {useCallback, useOptimistic, useState} from "react";
import type {Selection} from "@react-types/shared";

import {AssignMode, Entity, SearchOptions} from "@/types";

import {searchOfficesAction} from "@/actions/entities/offices";
import {searchAllAction} from "@/actions/search";
import {searchAssignableWorkspacesAction} from "@/actions/entities/workspaces";


export function useSearch() {

    const [searchPhrase, setSearchPhrase] = useState<string>();
    const [selectedFilterTags, setSelectedFilterTags] = useState<Selection>(new Set<string>());
    const [searchResults, setSearchResults] = useState<Entity[]>([]);

    const [assignMode, setAssignMode] = useState<AssignMode>("none");
    const [assignEmployeeOfficeNumber, setAssignEmployeeOfficeNumber] = useState<string>();
    const [assignEmployeeProgramAreaId, setAssignEmployeeProgramAreaId] = useState<number>();

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

    const runSearch = useCallback(async (query?: string, options?: SearchOptions) => {

        const effectiveMode = options?.modeOverride ?? assignMode
        const effectiveEmployeeOfficeNumber = options?.employeeOfficeNumber ?? assignEmployeeOfficeNumber;
        const effectiveEmployeeProgramAreaId = options?.employeeProgramAreaId ?? assignEmployeeProgramAreaId;

        let results: Entity[] = [];

        switch (effectiveMode) {

            case "office":
                results = await searchOfficesAction(query);
                break;

            case "workspace":
                if (!effectiveEmployeeOfficeNumber || effectiveEmployeeProgramAreaId == null) {
                    console.warn("Workspace search requested without employee office number or employee program area id")
                    results = []
                } else {
                    results = await searchAssignableWorkspacesAction(
                        effectiveEmployeeOfficeNumber,
                        effectiveEmployeeProgramAreaId,
                        query
                    );
                }
                break;

            case "none":
                results = await searchAllAction(query);
                break;
        }

        setSearchResults(results);
    }, [assignMode, assignEmployeeOfficeNumber, assignEmployeeProgramAreaId]);

    const refreshSearchResults = useCallback(() => runSearch(searchPhrase), [runSearch, searchPhrase])

    return {
        selectedFilterTags,
        setSelectedFilterTags,

        assignMode,
        setAssignMode,
        setAssignEmployeeOfficeNumber,
        setAssignEmployeeProgramAreaId,

        optimisticSearchResults,
        setOptimisticSearchResults,
        userHasSearchedOnce,
        searchResultsAreEmpty,
        handleSearch,
        runSearch,
        refreshSearchResults
    }
}
