import {MobileDeviceFormValues} from "@/types";
import {
    appendPrismaErrorCodeIfNeeded,
    BASE_PRISMA_ERROR_MESSAGE, getPrismaForeignKeyName,
    getPrismaUniqueFieldName
} from "@/actions/prismaErrorHelpers";
import {Prisma} from "@/generated/prisma/client";


export function getReadablePrismaError(error: unknown, mobileDevice?: MobileDeviceFormValues) {
    const base = BASE_PRISMA_ERROR_MESSAGE

    let errorMessage = base

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        const {code, meta} = error;

        console.log(`code :'${code}', message: '${error.message}'`);

        switch (code) {

            case "P2000": {

                errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: IMEI must be exactly 15 digits long, ADR Number must be exactly 18 characters long, GILR Number must be exactly 25 characters long, Office Number can be up to 3 digits long, and Notes can be up to 200 characters long.`

                break
            }

            case "P2002": {

                const errorFieldName = getPrismaUniqueFieldName(meta)

                switch (errorFieldName) {
                    case "imei":
                        if (mobileDevice?.imei) {
                            errorMessage = `IMEI '${mobileDevice.imei}' is already in use for some other mobile device.`
                        }
                        break

                    case "adr":
                        if (mobileDevice?.adr) {
                            errorMessage = `ADR Number '${mobileDevice.adr}' is already in use for some other mobile device.`
                        }
                        break

                    case "gilr":
                        if (mobileDevice?.gilr) {
                            errorMessage = `GILR Number '${mobileDevice.gilr}' is already in use for some other mobile device.`
                        }
                        break
                }

                if (errorMessage === base) {
                    // fallback if we can't determine the exact field
                    errorMessage = `A mobile device already exists with the same unique value. Please verify IMEI, ADR Number, or GILR Number and try again.`
                }

                break
            }

            case "P2003": {

                const foreignKey = getPrismaForeignKeyName(meta)

                switch (foreignKey) {
                    case "MobileDevice_office_number_fkey":
                        errorMessage = `The selected Office Number is invalid. Please enter a valid Office Number and try again.`
                        break

                    case "MobileDevice_model_id_fkey":
                        errorMessage = `It seems like a model wasn't selected for this new mobile device. Please select a model and try again.`
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
