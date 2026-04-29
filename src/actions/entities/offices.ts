"use server";

import {getOfficesByFilter} from "@/db/data-access/offices";

import {OfficeEntity} from "@/types";


export async function searchOfficesAction(query?: string): Promise<OfficeEntity[]> {
    const officeSearchResults = await getOfficesByFilter(query);

    // Attaching the discriminant 'type'
    const officesWithType: OfficeEntity[] = officeSearchResults.map(office => ({
        ...office,
        type: "office" as const,
    }))

    return officesWithType
}
