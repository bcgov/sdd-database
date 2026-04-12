import {useCallback} from "react";

import {fetchOhsAccommodationTypes} from "@/actions/lookups/ohsAccommodationTypes";

import {useLookup} from "@/hooks/lookups/useLookup";


export function useOhsAccommodationTypes()
{
    const fetcher = useCallback(()=> fetchOhsAccommodationTypes(), [])

    const {data} = useLookup(fetcher, "office types")

    return { ohsAccommodationTypes: data }
}
