"use server";

import {getBranches} from "@/prisma-db";

import {BranchOption} from "@/types";


export async function fetchBranches(): Promise<BranchOption[]> {
    return getBranches();
}
