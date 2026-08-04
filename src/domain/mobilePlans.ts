export const MOBILE_PLAN_DATA_ALLOWANCES_GB = [
    6,
    20,
    100
] as const

export const MOBILE_PLAN_STATUSES = [
    "Active",
    "Suspended",
    "Cancelled",
    "Investigate"
] as const

export const DEFAULT_MOBILE_PLAN_STATUS =
    "Active" satisfies (typeof MOBILE_PLAN_STATUSES)[number]

export const MOBILE_PLAN_SERVICE_PROVIDERS = [
    "Rogers",
    "Telus"
] as const

export function normalizeMobilePlanPhoneNumber(phoneNumber: string) {
    return phoneNumber.replaceAll("-", "")
}

export function formatMobilePlanPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")
}

export function getMobilePlanTitle(mobilePlan: {
    phone_number: string
    service_provider: {
        name: string
    }
}) {
    return `${formatMobilePlanPhoneNumber(mobilePlan.phone_number)} - ${mobilePlan.service_provider.name}`
}

/**
 * Raised when a plan chosen in the assignment UI is no longer eligible when
 * the user saves. It is intentionally a domain error rather than a raw Prisma
 * error so the UI can give a useful explanation.
 */
export class MobilePlanAssignmentError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "MobilePlanAssignmentError"
    }
}
