import {useCallback} from "react";

import {fetchOfficeTypesAction} from "@/actions/lookups/officeTypes";

import {useLookup} from "@/hooks/lookups/useLookup";


export function useOfficeTypes() {

    const fetcher = useCallback(() => fetchOfficeTypesAction(), []);

    const {data} = useLookup(fetcher, "office types")

    return { officeTypes: data}
}
