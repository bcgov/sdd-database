"use server";

import {getBranches} from "@/db/data-access/lookups";

import {LookupOption} from "@/types";


export async function fetchBranchesAction(): Promise<LookupOption[]> {
    return getBranches();
}
