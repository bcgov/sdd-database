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
