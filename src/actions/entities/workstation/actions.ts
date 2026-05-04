"use server";

import {
    addNewWorkstation,
    updateWorkstation,
    getAssignableWorkstationsByFilter,
    getWorkstationsByFilter,
} from "@/db/data-access/workstations";

import {EntityActionResult, WorkstationEntity} from "@/types";
import {parseWorkstationFormData} from "@/utils";
import {validateWorkstationData} from "@/actions/entities/workstation/rules";
import {createEntityActions} from "@/actions/createEntityActions";
import {getReadablePrismaError} from "@/actions/entities/workstation/errors";
import {attachEntityType} from "@/actions/attachEntityType";


export async function searchWorkstationsAction(query?: string): Promise<WorkstationEntity[]> {
    const workstationSearchResults = await getWorkstationsByFilter(query);

    // Attaching the discriminant 'type'
    return attachEntityType(workstationSearchResults, "workstation")
}

export async function searchAssignableWorkstationsAction(query?: string): Promise<WorkstationEntity[]> {
    const workstationSearchResults = await getAssignableWorkstationsByFilter(query);

    // Attaching the discriminant 'type'
    return attachEntityType(workstationSearchResults, "workstation")
}

const workstationActions = createEntityActions({
    parse: parseWorkstationFormData,
    validate: validateWorkstationData,
    persist: {
        create: addNewWorkstation,
        update: updateWorkstation,
    },
    getReadablePrismaError
})

export async function addNewWorkstationAction(
    prevState: EntityActionResult,
    formData: FormData
) {
    return workstationActions.addAction(prevState, formData)
}

export async function updateWorkstationAction(
    prevState: EntityActionResult,
    formData: FormData
) {
    return workstationActions.updateAction(prevState, formData)
}
