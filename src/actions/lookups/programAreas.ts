"use server";

import {getProgramAreasByBranch} from "@/db/data-access/lookups";

import {LookupOption} from "@/types";


export async function fetchProgramAreasByBranch(branchId: number): Promise<LookupOption[]> {
    return getProgramAreasByBranch(branchId);
}
