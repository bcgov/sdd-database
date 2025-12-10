"use server";

import {getProgramAreasByBranch} from "@/prisma-db";

import {ProgramAreaOption} from "@/types";


export async function fetchProgramAreasByBranch(branchId: number): Promise<ProgramAreaOption[]> {
    return getProgramAreasByBranch(branchId);
}
