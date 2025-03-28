"use server";

import {Workstation} from "@prisma/client";

import {addNewWorkstation, getWorkstationsByFilter, updateWorkstation} from "@/prisma-db";
import {Entity} from "@/types/Entity";


export async function addNewWorkstationAction(workstation: Workstation) {
    await addNewWorkstation(workstation);
}

export async function updateWorkstationAction(updatedWorkstation: Workstation) {
    await updateWorkstation(updatedWorkstation);
}

export async function searchWorkstationsAction(query?: string) {
    const workstationSearchResults = await getWorkstationsByFilter(query);

    // Attaching the discriminant 'type'
    const workstationsWithType: Entity[] = workstationSearchResults.map(workstation => ({
        ...workstation,
        type: "workstation" as const,
    }))

    return workstationsWithType
}
