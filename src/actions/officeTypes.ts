"use server";


import {LookupOption} from "@/types";

import {getOfficeTypes} from "@/db/prisma-db";


export async function fetchOfficeTypes(): Promise<LookupOption[]> {
    return getOfficeTypes();
}
