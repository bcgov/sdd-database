"use server";

import {Prisma, type Office} from "@/generated/prisma/client";

import {getOfficesByFilter, updateOffice} from "@/db/prisma-db";

import {Entity, EntityActionResult} from "@/types";

import {createEntityActions} from "@/actions/createEntityActions";


const parseOfficeFormData = (formData: FormData): Office => {
    return {
        office_number: formData.get("officeNumber") as string,
        office_name: formData.get("officeName") as string,
        type_id: Number(formData.get("type")),
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        postal_code: formData.get("postalCode") as string,
    }
}

function getReadablePrismaError(error: unknown) {

    let errorMessage = `An unexpected error occurred. Please refresh the page and try again. If the problem persists, please contact support with the error code shown at the end and a screenshot of the entire page.`;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        errorMessage += ` Error code: "${error.code}"`;
    }

    return errorMessage;
}

const officeActions = createEntityActions({
    parse: parseOfficeFormData,
    persist: {
        create: async () => {
            throw new Error("Creating new office is not supported.");
        },
        update: updateOffice
    },
    getReadablePrismaError
})

export async function updateOfficeAction(prevState: EntityActionResult, formData: FormData) {
    return officeActions.updateAction(prevState, formData);
}

export async function searchOfficesAction(query?: string) {
    const officeSearchResults = await getOfficesByFilter(query);

    // Attaching the discriminant 'type'
    const officesWithType: Entity[] = officeSearchResults.map(office => ({
        ...office,
        type: "office" as const,
    }))

    return officesWithType
}
