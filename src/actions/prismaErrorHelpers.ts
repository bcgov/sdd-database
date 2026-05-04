type DriverAdapterErrorMeta = {
    cause?: {
        constraint?: {
            fields?: string[];
            index?: string;
        }
    }
}

function getDriverAdapterError(meta: Record<string, unknown> | undefined) {
    const dae = meta?.driverAdapterError;

    return dae && typeof dae === "object" ? (dae as DriverAdapterErrorMeta) : undefined;
}

export const BASE_PRISMA_ERROR_MESSAGE = `An unexpected error occurred. Please refresh the page and try again. If the problem persists, please contact support with the error code shown at the end and a screenshot of the entire page.`

export function getPrismaUniqueFieldName(meta: Record<string, unknown> | undefined) {
    const dae = getDriverAdapterError(meta)

    return dae?.cause?.constraint?.fields?.[0]
}

export function getPrismaForeignKeyName(meta: Record<string, unknown> | undefined) {
    const dae = getDriverAdapterError(meta)

    return dae?.cause?.constraint?.index
}

/**
 * If we didn’t set a specific message in the matched case, append the code as a safety net.
 *
 * @param errorMessage
 * @param baseMessage
 * @param code
 */
export function appendPrismaErrorCodeIfNeeded(
    errorMessage: string,
    baseMessage: string,
    code: string,
) {
    return errorMessage === baseMessage
        ? `${errorMessage} Error code: "${code}"`
        : errorMessage
}
