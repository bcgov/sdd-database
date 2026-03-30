"use server";

import {getOfficesByFilter} from "@/db/data-access/offices";

import {Entity} from "@/types";


export async function searchOfficesAction(query?: string) {
    const officeSearchResults = await getOfficesByFilter(query);

    // Attaching the discriminant 'type'
    const officesWithType: Entity[] = officeSearchResults.map(office => ({
        ...office,
        type: "office" as const,
    }))

    return officesWithType
}
