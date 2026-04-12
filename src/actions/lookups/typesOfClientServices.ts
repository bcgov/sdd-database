"use server";

import {LookupOption} from "@/types";

import {getTypesOfClientServices} from "@/db/data-access/lookups";


export async function fetchTypesOfClientServicesAction(): Promise<LookupOption[]> {
    return getTypesOfClientServices();
}
