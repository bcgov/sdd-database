import {useCallback} from "react";

import {fetchBranchesAction} from "@/actions/lookups/branches";

import {useLookup} from "@/hooks/lookups/useLookup";


export function useBranches() {

    const fetcher = useCallback(() => fetchBranchesAction(), []);

    const {data} = useLookup(fetcher, "branches")

    return { branches: data}
}
