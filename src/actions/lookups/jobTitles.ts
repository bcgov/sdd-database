"use server";

import {getJobTitlesByProgramArea} from "@/db/data-access/lookups";

import {LookupOption} from "@/types";


export async function fetchJobTitlesByProgramArea(programAreaId: number): Promise<LookupOption[]> {
    return getJobTitlesByProgramArea(programAreaId)
}
