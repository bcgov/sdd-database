"use server";


import {TypeOfClientServiceOption} from "@/types";

import {getTypesOfClientServices} from "@/db/prisma-db";


export async function fetchTypesOfClientServices(): Promise<TypeOfClientServiceOption[]> {
    return getTypesOfClientServices();
}
