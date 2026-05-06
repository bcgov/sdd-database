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

export function normalizeJobTitleName(rawJobTitle: string) {
    const remappedJobTitleNames: Record<string, string> = {
        "ADM Service Delivery Division": "Assistant Deputy Minister (ADM)",

        "Director, Analytics and Business Intelligence": "Director",
        "Director, Communications Engagement and Organizational Health": "Director",
        "Director, Finance, Contracts, Records Management": "Director",
        "Director, Knowledge Management": "Director",
        "Director, Operations": "Director",
        "Director, Program Integrity and Evaluation": "Director",
        "Director, Recruitment, Staffing, Facilities and Assets": "Director",
        "Director, Strategic Partnerships and Communications": "Director",
        "Director, Strategic Projects and Technology Integration": "Director",

        "Employment Assistance Worker": "Employment Assistance Worker (EAW)",

        "Executive Director, Community Integration Services": "Executive Director",
        "Executive Director, Operations Support": "Executive Director",
        "Executive Director, PLMS": "Executive Director",
        "Executive Director, Stratgic Services": "Executive Director",

        "Manager, Analytics and Business Intelligence": "Manager",
        "Manager, Operations": "Manager",
    }

    return remappedJobTitleNames[rawJobTitle] ?? rawJobTitle
}
