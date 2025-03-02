"use server";

import {getOfficesByFilter, updateOffice} from "@/prisma-db";

export async function searchOfficesAction(query: string) {
    return getOfficesByFilter(query);
}

export async function updateOfficeAction(office_number: string, notes: string | null) {
    await updateOffice(office_number, notes);
}