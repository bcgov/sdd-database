"use server";

import {
    getAssignableWorkstationsByFilter,
    getWorkstationsByFilter,
} from "@/db/data-access/workstations";

import {WorkstationEntity} from "@/types";


export async function searchWorkstationsAction(query?: string): Promise<WorkstationEntity[]> {
    const workstationSearchResults = await getWorkstationsByFilter(query);

    // Attaching the discriminant 'type'
    const workstationsWithType: WorkstationEntity[] = workstationSearchResults.map(workstation => ({
        ...workstation,
        type: "workstation" as const,
    }))

    return workstationsWithType
}

export async function searchAssignableWorkstationsAction(query?: string): Promise<WorkstationEntity[]> {
    const workstationSearchResults = await getAssignableWorkstationsByFilter(query);

    // Attaching the discriminant 'type'
    const workstationsWithType: WorkstationEntity[] = workstationSearchResults.map(workstation => ({
        ...workstation,
        type: "workstation" as const,
    }))

    return workstationsWithType
}
