"use server";

import {
    getMobilePlanServiceProviders,
    getMobilePlanStatuses
} from "@/db/data-access/lookups";
import {LookupOption} from "@/types";


export type MobilePlanLookupOptions = {
    statuses: LookupOption[]
    serviceProviders: LookupOption[]
}

export async function fetchMobilePlanLookupsAction(): Promise<MobilePlanLookupOptions> {
    const [statuses, serviceProviders] = await Promise.all([
        getMobilePlanStatuses(),
        getMobilePlanServiceProviders()
    ])

    return {
        statuses,
        serviceProviders
    }
}
