"use server";

import {getBranches} from "@/db/prisma-db";

import {BranchOption} from "@/types";


export async function fetchBranches(): Promise<BranchOption[]> {
    return getBranches();
}
