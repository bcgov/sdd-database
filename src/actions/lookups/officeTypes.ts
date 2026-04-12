"use server";


import {LookupOption} from "@/types";

import {getOfficeTypes} from "@/db/data-access/lookups";


export async function fetchOfficeTypesAction(): Promise<LookupOption[]> {
    return getOfficeTypes();
}
