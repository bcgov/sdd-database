"use server";

import {LookupOption} from "@/types";
import {getMobileDeviceModels} from "@/db/data-access/lookups";


export async function fetchMobileDeviceModelsAction(): Promise<LookupOption[]> {
    return getMobileDeviceModels()
}
