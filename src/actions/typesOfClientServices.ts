"use server";

import {LookupOption} from "@/types";

import {getTypesOfClientServices} from "@/db/prisma-db";


export async function fetchTypesOfClientServices(): Promise<LookupOption[]> {
    return getTypesOfClientServices();
}
