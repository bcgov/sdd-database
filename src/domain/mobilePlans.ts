export function normalizeMobilePlanPhoneNumber(phoneNumber: string) {
    return phoneNumber.replaceAll("-", "")
}

export function formatMobilePlanPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")
}
