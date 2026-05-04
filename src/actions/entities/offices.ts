"use server";

import {getOfficesByFilter} from "@/db/data-access/offices";

import {OfficeEntity} from "@/types";
import {attachEntityType} from "@/actions/attachEntityType";


export async function searchOfficesAction(query?: string): Promise<OfficeEntity[]> {
    const officeSearchResults = await getOfficesByFilter(query);

    // Attaching the discriminant 'type'
    return attachEntityType(officeSearchResults, "office")
}
