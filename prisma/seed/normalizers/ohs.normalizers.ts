export function normalizeAccommodationName(rawAccommodationName: string) {
    const remappedAccommodationNames: Record<string, string> = {
        "H/A Accommodation": "Height Adjustable Desk Accommodation"
    }

    return remappedAccommodationNames[rawAccommodationName] ?? rawAccommodationName
}
