export function normalizeCategoryName(rawCategoryName: string) {
    const remappedCategoryNames: Record<string, string> = {
        "POC": "Point of Contact (POC)"
    };

    return remappedCategoryNames[rawCategoryName] ?? rawCategoryName;
}
