import {useCallback} from "react";

import {fetchProgramAreasByBranchAction} from "@/actions/lookups/programAreas";

import {useDependentLookup} from "@/hooks/lookups/useDependentLookup";


export function useProgramAreas(branchId?: number) {

    const fetcher = useCallback(
        (id: number) => fetchProgramAreasByBranchAction(id),
        []
    )

    const {data} = useDependentLookup(
        branchId,
        fetcher,
        "program areas"
    )

    return { programAreas: data };
}
