import {useMobilePlanLookups} from "@/hooks/lookups/useMobilePlanLookups";


export function useMobilePlanLookupProps() {
    const {
        mobilePlanStatuses,
        mobilePlanServiceProviders
    } = useMobilePlanLookups()

    return {
        statuses: mobilePlanStatuses,
        serviceProviders: mobilePlanServiceProviders
    }
}
