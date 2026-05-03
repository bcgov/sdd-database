"use server";

import {LookupOption} from "@/types";
import {getWorkstationModels} from "@/db/data-access/lookups";


export async function fetchWorkstationModelsAction(): Promise<LookupOption[]> {
    return getWorkstationModels()
}
