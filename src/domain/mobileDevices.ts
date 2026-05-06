const MODELS_WITHOUT_IMEI = new Set([
    "Office in a Box (OiaB)",
    "Qualcomm GSP-1700",
])

export function mobileDeviceModelRequiresImei(modelName: string | undefined) {
    if (!modelName) return false

    return !MODELS_WITHOUT_IMEI.has(modelName)
}
