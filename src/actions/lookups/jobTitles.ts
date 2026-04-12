"use server";

import {getJobTitlesByProgramArea} from "@/db/data-access/lookups";

import {LookupOption} from "@/types";


export async function fetchJobTitlesByProgramAreaAction(programAreaId: number): Promise<LookupOption[]> {
    return getJobTitlesByProgramArea(programAreaId)
}
