import {useCallback} from "react";

import {fetchJobTitlesByProgramAreaAction} from "@/actions/lookups/jobTitles";

import {useDependentLookup} from "@/hooks/lookups/useDependentLookup";


export function useJobTitles(programAreaId?: number) {

    const fetcher = useCallback(
        (id: number) => fetchJobTitlesByProgramAreaAction(id),
        []
    )

    const {data} = useDependentLookup(
        programAreaId,
        fetcher,
        "job titles"
    );

    return { jobTitles: data }
}
