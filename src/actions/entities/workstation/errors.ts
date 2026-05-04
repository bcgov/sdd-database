import {WorkstationFormValues} from "@/types";
import {Prisma} from "@/generated/prisma/client";
import {
    appendPrismaErrorCodeIfNeeded,
    BASE_PRISMA_ERROR_MESSAGE,
    getPrismaForeignKeyName, getPrismaUniqueFieldName
} from "@/actions/prismaErrorHelpers";


export function getReadablePrismaError(error: unknown, workstation?: WorkstationFormValues) {

    const base = BASE_PRISMA_ERROR_MESSAGE

    let errorMessage = base

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        const {code, meta} = error;

        console.log(`code :'${code}', message: '${error.message}'`);

        switch (code) {

            case "P2000": {

                errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: Asset Tag has a model-specific length (8, 10 or 14), Office Number can be up to 3 digits long, and Notes can be upto 2000 characters long.`;

                break
            }

            case "P2002": {

                const errorFieldName = getPrismaUniqueFieldName(meta)

                if (errorFieldName === "asset_tag" && workstation?.asset_tag) {
                    errorMessage = `Asset Tag '${workstation.asset_tag}' is already in use for some other workstation`
                } else {

                    // fallback if we can't determine the exact field
                    errorMessage = `A workstation already exists with the same unique value. Please verify asset tag and try again.`;
                }

                break
            }

            case "P2003": {

                const foreignKey = getPrismaForeignKeyName(meta)

                switch (foreignKey) {
                    case "Workstation_office_number_fkey":
                        errorMessage = `The selected Office Number is invalid. Please enter a valid Office Number and try again.`
                        break

                    case "Workstation_model_id_fkey":
                        errorMessage = `It seems like a model wasn't selected for this new workstation. Please select a model and try again.`
                        break
                }
                break
            }

            case "P2025": {
                const modelName = meta?.modelName ?? "record"

                errorMessage = `You are trying to edit a ${modelName} that no longer exists. Please refresh the page to get the latest list of ${modelName}s.`

                break
            }

            default: {
                errorMessage += ` Error code: "${code}"`
            }
        }
        // If we didn’t set a specific message in the matched case, append the code as a safety net.
        errorMessage = appendPrismaErrorCodeIfNeeded(errorMessage, base, code)
    }

    console.error(error)

    return errorMessage
}
