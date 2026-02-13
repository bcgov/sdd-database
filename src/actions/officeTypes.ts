"use server";


import {OfficeTypeOption} from "@/types";

import {getOfficeTypes} from "@/db/prisma-db";


export async function fetchOfficeTypes(): Promise<OfficeTypeOption[]> {
    return getOfficeTypes();
}
