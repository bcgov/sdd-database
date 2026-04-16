export function normalizeProgramAreaName(rawProgramArea: string) {
    const remappedProgramAreaNames: Record<string, string> = {
        "Community Integration Services - Service Delivery": "Service Delivery",
        "Community Integration Services - Practice and Performance": "Practice and Performance",
        "Executive Director Community Integration Services": "Executive Director",

        "Community Services - Area A Staff": "Area A Staff",
        "Community Services - Area B Staff": "Area B Staff",
        "Community Services - Area C Staff": "Area C Staff",

        "ADM - Service Delivery Division": "Service Delivery Division",

        "Executive Director - Operations Support": "Executive Director",
        "Analytics And Business Intelligence": "Analytics and Business Intelligence",

        "Executive Director Prevention and Loss Management Services": "Executive Director",
        "PLMS Operations": "Operations",

        "Executive Director-Strategic Services": "Executive Director",

        "Executive Director - Virtual Services": "Executive Director",

        "Ministry Of Attorney General": "Attorney General",
        "Ministry Of Children and Family Development": "Children and Family Development",
        "Citizens Services": "Citizens' Services",
        "Ministry Of Forests": "Forests",
        "Ministry Of Health": "Health",
        "Ministry Of Housing and Municipal Affairs": "Housing and Municipal Affairs",
        "Ministry Of Infrastructure": "Infrastructure",
        "Ministry Of Post Secondary Education and Skills": "Post-Secondary Education and Future Skills",
        "Ministry of Transportation and Transit": "Transportation and Transit",
        "Ministry Of Water, Land, Resource and Stewardship": "Water, Land and Resource Stewardship"
    }

    return remappedProgramAreaNames[rawProgramArea] ?? rawProgramArea
}
