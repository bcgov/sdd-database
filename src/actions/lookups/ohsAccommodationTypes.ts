"use server"

import {LookupOption} from "@/types";
import {getOhsAccommodationTypes} from "@/db/data-access/lookups";


export async function fetchOhsAccommodationTypes(): Promise<LookupOption[]> {
    return getOhsAccommodationTypes();
}
