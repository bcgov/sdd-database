"use server";

import {Prisma, type Workstation} from "@/generated/prisma/client";

import {
    addNewWorkstation,
    getWorkstationsByFilter,
    updateWorkstation
} from "@/db/prisma-db";

import {Entity, EntityActionResult} from "@/types";

import {validateAssetTagField, validateNotesField} from "@/validators";

import {createEntityActions} from "@/actions/createEntityActions";


const parseWorkstationFormData = (formData: FormData): Workstation => {
    return {
        asset_tag: formData.get("assetTag") as string,
        notes: formData.get("notes") as string || null,
    }
}

function validateWorkstationData(workstation: Workstation) {

    return (
        validateAssetTagField(workstation.asset_tag) ??
        (workstation.notes ? validateNotesField(workstation.notes) : undefined)
    )
}

function getReadablePrismaError(error: unknown, workstation: Workstation) {

    let errorMessage = `An unexpected error occurred. Please refresh the page and try again. If the problem persists, please contact support with the error code shown at the end and a screenshot of the entire page.`;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        const {code, meta} = error;

        switch (code) {

            case "P2000": {
                errorMessage = `Notes can be upto 2000 characters long. Please shorten it and try again.`;
                break;
            }
            case "P2002": {
                let errorFieldName

                if (Array.isArray(meta?.target)) {
                    errorFieldName = meta.target[0]

                    if (errorFieldName === "asset_tag") {
                        errorMessage = `Asset Tag '${workstation.asset_tag}' is already in use for some other workstation`
                    }
                }

                break;
            }
            default: {
                errorMessage += ` Error code: "${code}"`;
            }
        }
    }

    console.error(error);

    return errorMessage;
}

const workstationActions = createEntityActions({
    parse: parseWorkstationFormData,
    validate: validateWorkstationData,
    persist: {
        create: addNewWorkstation,
        update: updateWorkstation
    },
    getReadablePrismaError
})

export async function addNewWorkstationAction(prevState: EntityActionResult, formData: FormData) {
    return workstationActions.addAction(prevState, formData);
}

export async function updateWorkstationAction(prevState: EntityActionResult, formData: FormData) {
    return workstationActions.updateAction(prevState, formData);
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
