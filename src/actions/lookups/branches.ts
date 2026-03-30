"use server";

import {getBranches} from "@/db/data-access/lookups";

import {LookupOption} from "@/types";


export async function fetchBranches(): Promise<LookupOption[]> {
    return getBranches();
}
