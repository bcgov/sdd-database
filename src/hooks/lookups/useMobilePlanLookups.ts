import {useCallback} from "react";
import {
    fetchMobilePlanLookupsAction,
    MobilePlanLookupOptions
} from "@/actions/lookups/mobilePlans";
import {useLookup} from "@/hooks/lookups/useLookup";


export function useMobilePlanLookups() {
    const fetcher = useCallback(
        (): Promise<MobilePlanLookupOptions> => fetchMobilePlanLookupsAction(),
        []
    )

    const {data} = useLookup(fetcher, "mobile plan lookup options")

    return {
        mobilePlanStatuses: data?.statuses ?? [],
        mobilePlanServiceProviders: data?.serviceProviders ?? []
    }
}
