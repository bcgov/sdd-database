"use server";


import {LookupOption} from "@/types";

import {getOfficeTypes} from "@/db/data-access/lookups";


export async function fetchOfficeTypes(): Promise<LookupOption[]> {
    return getOfficeTypes();
}
