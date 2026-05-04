import {MobileDeviceFormValues} from "@/types";
import {
    appendPrismaErrorCodeIfNeeded,
    BASE_PRISMA_ERROR_MESSAGE,
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

                errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: IMEI must be exactly 15 digits long.`

                break

            }

            case "P2002": {

                const errorFieldName = getPrismaUniqueFieldName(meta)

                if (errorFieldName === "imei" && mobileDevice?.imei) {
                    errorMessage = `IMEI '${mobileDevice.imei}' is already in use for some other mobile device.`
                } else {

                    // fallback if we can't determine the exact field
                    errorMessage = `A mobile device already exists with the same unique value. Please verify IMEI and try again.`
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
