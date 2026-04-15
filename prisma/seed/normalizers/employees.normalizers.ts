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
