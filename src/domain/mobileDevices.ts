// Using type-only import to prevent circular dependency
import type {MobileDeviceEntity} from "@/types";
import type {CalendarDate} from "@internationalized/date";


export const MOBILE_DEVICE_STATUSES = [
    "unassigned",
    "assigned",
    "adr",
    "gilr"
] as const

export type MobileDeviceStatus = (typeof MOBILE_DEVICE_STATUSES)[number]

const MODELS_WITHOUT_IMEI = new Set([
    "Office in a Box (OiaB)",
    "Qualcomm GSP-1700",
])

const MOBILE_DEVICE_PAYMENT_TERM_MONTHS = 36

export function mobileDeviceModelRequiresImei(modelName: string | undefined) {
    if (!modelName) return false

    return !MODELS_WITHOUT_IMEI.has(modelName)
}

export function getMobileDeviceStatus(mobileDevice: {
    employee_id: number | null
    adr: string | null
    gilr: string | null
}): MobileDeviceStatus {

    if (mobileDevice.adr) return "adr"
    if (mobileDevice.gilr) return "gilr"
    if (mobileDevice.employee_id !== null) return "assigned"

    return "unassigned"
}

export function isMobileDeviceStatus(value: string): value is MobileDeviceStatus {
    return MOBILE_DEVICE_STATUSES.some(status => status === value)
}

export function getMobileDeviceTitle(
    mobileDevice: Pick<MobileDeviceEntity, "imei" | "mobile_device_model">
) {
    const modelName = mobileDevice.mobile_device_model.name

    return mobileDevice.imei
        ? `${modelName} - ${mobileDevice.imei}`
        : `${modelName}`
}

export function calculateMobileDevicePaymentEndDate(orderDate: CalendarDate) {
    return orderDate.add({
        months: MOBILE_DEVICE_PAYMENT_TERM_MONTHS
    })
}
