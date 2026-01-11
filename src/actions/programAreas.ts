"use server";

import {getProgramAreasByBranch} from "@/db/prisma-db";

import {ProgramAreaOption} from "@/types";


export async function fetchProgramAreasByBranch(branchId: number): Promise<ProgramAreaOption[]> {
    return getProgramAreasByBranch(branchId);
}
