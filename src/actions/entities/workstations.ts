"use server";

import {
    getWorkstationsByFilter,
} from "@/db/data-access/workstations";

import {Entity} from "@/types";


export async function searchWorkstationsAction(query?: string) {
    const workstationSearchResults = await getWorkstationsByFilter(query);

    // Attaching the discriminant 'type'
    const workstationsWithType: Entity[] = workstationSearchResults.map(workstation => ({
        ...workstation,
        type: "workstation" as const,
    }))

    return workstationsWithType
}
