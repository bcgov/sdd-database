import {MobileDeviceEntity} from "@/types";


const MODELS_WITHOUT_IMEI = new Set([
    "Office in a Box (OiaB)",
    "Qualcomm GSP-1700",
])

export function mobileDeviceModelRequiresImei(modelName: string | undefined) {
    if (!modelName) return false

    return !MODELS_WITHOUT_IMEI.has(modelName)
}

export function getMobileDeviceTitle(
    mobileDevice: Pick<MobileDeviceEntity, "imei" | "mobile_device_model">
) {
    const modelName = mobileDevice.mobile_device_model.name

    return mobileDevice.imei
        ? `${modelName} - ${mobileDevice.imei}`
        : `${modelName}`
}
