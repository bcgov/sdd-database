"use server";

import {getBranches} from "@/db/prisma-db";

import {LookupOption} from "@/types";


export async function fetchBranches(): Promise<LookupOption[]> {
    return getBranches();
}
