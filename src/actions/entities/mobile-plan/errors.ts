import {Prisma} from "@/generated/prisma/client";
import {MobilePlanFormValues} from "@/types";
import {
    appendPrismaErrorCodeIfNeeded,
    BASE_PRISMA_ERROR_MESSAGE,
    getPrismaForeignKeyName,
    getPrismaUniqueFieldName
} from "@/actions/prismaErrorHelpers";
import {formatMobilePlanPhoneNumber} from "@/domain/mobilePlans";


export function getReadablePrismaError(
    error: unknown,
    mobilePlan?: MobilePlanFormValues
) {
    const base = BASE_PRISMA_ERROR_MESSAGE
    let errorMessage = base

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const {code, meta} = error

        console.log(`code :'${code}', message: '${error.message}'`)

        switch (code) {
            case "P2000":
                errorMessage = "Phone Number must be exactly 10 digits long."
                break

            case "P2002": {
                const errorFieldName = getPrismaUniqueFieldName(meta)

                if (errorFieldName === "phone_number" && mobilePlan?.phone_number) {
                    const phoneNumber = formatMobilePlanPhoneNumber(
                        mobilePlan.phone_number
                    )

                    errorMessage = `Phone Number '${phoneNumber}' is already in use for another mobile plan.`
                } else {
                    errorMessage = "A mobile plan already exists with the same Phone Number."
                }

                break
            }

            case "P2003": {
                const foreignKey = getPrismaForeignKeyName(meta)

                switch (foreignKey) {
                    case "MobilePlan_status_id_fkey":
                        errorMessage = "The selected Status is invalid. Please reselect a status and try again."
                        break

                    case "MobilePlan_service_provider_id_fkey":
                        errorMessage = "The selected Service Provider is invalid. Please reselect a service provider and try again."
                        break
                }

                break
            }

            default:
                errorMessage += ` Error code: "${code}"`
        }

        errorMessage = appendPrismaErrorCodeIfNeeded(
            errorMessage,
            base,
            code
        )
    }

    console.error(error)

    return errorMessage
}
