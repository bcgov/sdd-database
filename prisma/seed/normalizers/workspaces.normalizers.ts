export function normalizeCategoryName(rawCategoryName: string) {
    const remappedCategoryNames: Record<string, string> = {
        "POC": "Point of Contact (POC)"
    };

    return remappedCategoryNames[rawCategoryName] ?? rawCategoryName;
}

export function normalizeDeskTypeName(rawDeskTypeName: string) {
    const remappedDeskTypeNames: Record<string, string> = {
        "H/A": "Height Adjustable",
        "H/A Accommodation": "Height Adjustable Accommodation",
        "Non H/A": "Non-Height Adjustable",
    };

    return remappedDeskTypeNames[rawDeskTypeName] ?? rawDeskTypeName;
}
