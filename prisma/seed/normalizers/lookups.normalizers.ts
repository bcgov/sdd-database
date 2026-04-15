export function normalizeProgramAreaName(rawProgramArea: string) {
    const remappedProgramAreaNames: Record<string, string> = {
        "Community Integration Services - Service Delivery": "Service Delivery",
        "Community Integration Services - Practice And Performance": "Practice and Performance",
        "Executive Director Community Integration Services": "Executive Director",

        "Community Services - Area A Staff": "Area A Staff",
        "Community Services - Area B Staff": "Area B Staff",
        "Community Services - Area C Staff": "Area C Staff",

        "ADM - Service Delivery Division": "Service Delivery Division",

        "Finance, Contracts And Records Management": "Finance, Contracts and Records Management",
        "Recruitment, Staffing, Facilities, And Assets": "Recruitment, Staffing, Facilities, and Assets",
        "Executive Director - Operations Support": "Executive Director",
        "Analytics And Business Intelligence": "Analytics and Business Intelligence",
        "Communications Engagement And Organizational Health": "Communications Engagement and Organizational Health",

        "Executive Director Prevention and Loss Management Services": "Executive Director",
        "PLMS Operations": "Operations",
        "Program Integrity & Evaluation": "Program Integrity and Evaluation",

        "Executive Director-Strategic Services": "Executive Director",
        "Strategic Projects & Technology Integration": "Strategic Projects and Technology Integration",
        "Strategic Partnerships And Communications": "Strategic Partnerships and Communications",

        "Executive Director - Virtual Services": "Executive Director",
        "Health & Specialized Services": "Health and Specialized Services",

        "Ministry Of Attorney General": "Attorney General",
        "Ministry Of Children And Family Development": "Children and Family Development",
        "Citizens Services": "Citizens' Services",
        "Ministry Of Forests": "Forests",
        "Ministry Of Health": "Health",
        "Housing And Municipal Affairs": "Housing and Municipal Affairs",
        "Ministry Of Infrastructure": "Infrastructure",
        "Post Secondary Education And Skills": "Post-Secondary Education and Future Skills",
        "Ministry of Transportation and Transit": "Transportation and Transit",
        "Ministry Of Water, Land, Resource And Stewardship": "Water, Land and Resource Stewardship"
    }

    return remappedProgramAreaNames[rawProgramArea] ?? rawProgramArea
}
