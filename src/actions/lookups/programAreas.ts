"use server";

import {getProgramAreasByBranch} from "@/db/prisma-db";

import {LookupOption} from "@/types";


export async function fetchProgramAreasByBranch(branchId: number): Promise<LookupOption[]> {
    return getProgramAreasByBranch(branchId);
}
