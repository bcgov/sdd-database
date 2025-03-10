"use server";

import {getOfficesByFilter, updateOffice} from "@/prisma-db";
import {Entity} from "@/types/Entity";

export async function searchOfficesAction(query?: string) {
    const officeSearchResults = await getOfficesByFilter(query);

    // Attaching the discriminant 'type'
    const officesWithType: Entity[] = officeSearchResults.map(office => ({
        ...office,
        type: "office" as const,
    }))

    return officesWithType
}

export async function updateOfficeAction(office_number: string, notes: string | null) {
    await updateOffice(office_number, notes);
}
