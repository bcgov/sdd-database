"use server";

import {LookupOption} from "@/types";

import {getTypesOfClientServices} from "@/db/data-access/lookups";


export async function fetchTypesOfClientServices(): Promise<LookupOption[]> {
    return getTypesOfClientServices();
}
