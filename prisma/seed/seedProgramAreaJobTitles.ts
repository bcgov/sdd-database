import {PrismaClient} from "@/generated/prisma/client";
import {buildIdLookupByName, idNameSelect} from "./lookups";


const jobTitlesByProgramAreaByBranch: Record<string, Record<string, string[]>> = {
    "Community Integration Services": {
        "Executive Director": [
            "Branch Coordinator",
            "Executive Director",
        ],
        "Practice and Performance": [
            "Director, Partnerships, Performance and Practice",
            "Director, Service Delivery",
            "Manager, Partnerships and Practice",
            "Manager, Program Evaluation and Reporting",
            "Program Evaluation Specialist",
            "Project Analyst",
            "Project Support Analyst",
            "Project Support Intern",
            "Research Analyst",
            "Senior Policy and Program Specialist",
            "Senior Policy and Project Specialist",
        ],
        "Service Delivery": [
            "Administrative and Asset Administrator",
            "Assistant Supervisor (ADS)",
            "Community Integration Specialist",
            "Director, Service Delivery",
            "Manager, Service Delivery",
            "Supervisor, Service Delivery",
        ],
    },

    "Community Services": {
        "Area A Staff": [
            "Assistant Supervisor (ADS)",
            "Client Service Worker (CSW)",
            "Contractor",
            "Director, Service Delivery",
            "Employment Assistance Worker",
            "Manager, Service Delivery",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
        "Area B Staff": [
            "Assistant Supervisor (ADS)",
            "Client Service Worker (CSW)",
            "Contractor",
            "Director, Service Delivery",
            "Employment Assistance Worker",
            "Manager, Service Delivery",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
        "Area C Staff": [
            "Assistant Supervisor (ADS)",
            "Client Service Worker (CSW)",
            "Contractor",
            "Director, Service Delivery",
            "Employment Assistance Worker",
            "Manager, Service Delivery",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
        "Executive Director": [
            "Branch Coordinator",
            "Executive Director, Service Delivery",
        ],
    },

    "Office of the ADM": {
        "Service Delivery Division": [
            "Assistant Deputy Minister (ADM)",
            "Executive Administrative Assistant",
            "Manager, Strategic Issues",
        ],
    },

    "Operations Support": {
        "Analytics and Business Intelligence": [
            "Business Application Administrator",
            "Director",
            "Full Stack Developer",
            "Manager",
            "Senior Business Analyst",
            "Senior Business Intelligence Analyst",
            "Senior Data Architect",
            "Senior Data Architect and Data Scientist",
        ],
        "Communications Engagement and Organizational Health": [
            "Communications Analyst",
            "Communications and Engagement Analyst",
            "Director",
            "Manager, Organizational Health and Development",
            "Marketing Leader",
            "Program Specialist",
            "Workplace Health Advisor",
            "Research and Project Support",
        ],
        "Executive Director": [
            "Branch Coordinator",
            "Executive Director",
        ],
        "Finance, Contracts and Records Management": [
            "Client Service Worker (CSW)",
            "Contract Analyst",
            "Director",
            "Financial Analyst",
            "Manager, Contracts",
            "Manager, Financial Services",
            "Operations Support Clerk",
            "Program Support Clerk",
            "Program Support Supervisor",
            "Records Clerk",
            "Records Management Supervisor",
            "Senior Budget Analyst",
            "Senior Business Analyst",
            "Senior Financial Contract Analyst",
            "Senior Records Management Analyst",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
        "Recruitment, Staffing, Facilities, and Assets": [
            "Director",
            "Facilities and Assets Administrator",
            "Facilities and Assets Coordinator",
            "Manager, Facilities and Assets",
            "Manager, Recruitment",
            "Manager, Senior Project",
            "Manager, Staffing",
            "Program Support Clerk",
            "Project Management Analyst",
            "Recruitment and Staffing Analyst",
            "Recruitment and Staffing Clerk",
            "Recruitment and Staffing Coordinator",
            "Senior Business Analyst",
            "Senior Facilities and Assets Coordinator",
            "Supervisor, Recruitment and Staffing",
        ],
    },

    "Prevention and Loss Management Services": {
        "Criminal Investigation Unit": [
            "Client Service Representative (CSR)",
            "Director, Criminal Operations",
            "Major Case File Specialist",
            "Manager, Criminal Operations",
            "Ministry Investigator",
            "Senior Investigator",
            "Senior Ministry Investigator",
            "Senior Program Analyst",
            "Supervisor, Criminal Investigations",
            "Unit Administrator",
        ],
        "Executive Director": [
            "Executive Director",
        ],
        "Operations": [
            "Director",
            "Employment Assistance Worker",
            "Manager",
            "Quality and Compliance Specialist",
            "Supervisor, Prevention and Compliance",
        ],
        "Program Integrity and Evaluation": [
            "Client Service Representative (CSR)",
            "Data Analyst",
            "Director",
            "Junior Performance Analyst",
            "Junior Program Analyst",
            "Manager, Data and Evaluation",
            "Manager, Program Evaluation",
            "Manager, Program Integrity",
            "Manager, SD and Program Development",
            "Program and Policy Analyst",
            "Program Evaluation Specialist",
            "Senior Data Analyst",
            "Senior Data Architect and Data Scientist",
            "Senior Project Management Analyst",
            "Supervisor, Program Support",
            "Team Lead, Program Evaluation",
        ],
    },

    "Strategic Services": {
        "Executive Director": [
            "Administrative Assistant",
            "Branch Coordinator",
            "Executive Director",
            "Senior Manager, Policy and Knowledge Management",
        ],
        "Knowledge Management": [
            "Director",
            "Job Resources Analyst",
            "Job Resources Lead",
            "Lead Trainer",
            "Manager, Learning and Development",
            "Manager, Trainer Program",
            "Trainer",
            "Training Coordinator",
            "Training Specialist",
        ],
        "Strategic Partnerships and Communications": [
            "Community Relations and Stakeholder Analyst",
            "Director",
            "Manager, Community Relations and Service Quality",
            "Manager, Policy and Implementation Strategy",
            "Policy Interpretation and Coordination Analyst",
            "Senior Manager, Community Relations and Program Communication",
            "Senior Manager, Policy Interpretation and Implementation",
            "Senior Policy and Project Analyst",
        ],
        "Strategic Projects and Technology Integration": [
            "Director",
            "Manager, Business Technology Integration",
            "Manager, Strategic Planning and Projects",
            "Policy and Project Analyst",
            "Process and Project Analyst",
            "Senior Policy and Project Analyst",
            "Senior Project Management Advisor",
        ],
    },

    "Virtual Services": {
        "Contact Centre": [
            "Assistant Supervisor (ADS)",
            "Client Service Worker (CSW)",
            "Director, Service Delivery",
            "Employment Assistance Worker",
            "Manager, Service Delivery",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
        "Executive Director": [
            "Branch Coordinator",
            "Executive Director, Service Delivery",
        ],
        "Health and Specialized Services": [
            "Adjudicator",
            "Assistant Supervisor (ADS)",
            "Client Service Worker (CSW)",
            "Director, Service Delivery",
            "Employment Assistance Worker",
            "Manager, Service Delivery",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
        "Intake": [
            "Assistant Supervisor (ADS)",
            "Client Service Worker (CSW)",
            "Director, Service Delivery",
            "Employment Assistance Worker",
            "Manager, Service Delivery",
            "Supervisor, Administrative Services",
            "Supervisor, Service Delivery",
        ],
    },

    "Non SDD": {
        "Other": [
            "Contractor"
        ]
    }
}


export async function seedProgramAreaJobTitles(prismaClient: PrismaClient) {

    const programAreas = await prismaClient.programArea.findMany({
        select: {
            id: true,
            name: true,
            branch: {
                select: {
                    name: true
                }
            }
        }
    })
    const programAreaLookup = new Map<string, number>()
    for (const programArea of programAreas) {
        const key = `${programArea.branch.name}::${programArea.name}`
        programAreaLookup.set(key, programArea.id)
    }

    const jobTitleLookup = buildIdLookupByName(
        await prismaClient.jobTitle.findMany({
            select: idNameSelect,
        })
    )

    const rowsToInsert: Array<{
        program_area_id: number
        job_title_id: number
    }> = []

    for (const [branchName, jobTitlesByProgramArea] of Object.entries(jobTitlesByProgramAreaByBranch)) {
        for (const [programAreaName, allowedJobTitles] of Object.entries(jobTitlesByProgramArea)) {

            const programAreaKey = `${branchName}::${programAreaName}`
            const programAreaId = programAreaLookup.get(programAreaKey)

            if (!programAreaId) {
                console.warn(`⚠️ Skipping ProgramAreaJobTitle rows because program area "${programAreaName}" under branch "${branchName}" does not exist yet.`)
                continue
            }

            for (const jobTitleName of allowedJobTitles) {
                const jobTitleId = jobTitleLookup.get(jobTitleName)

                if (!jobTitleId) {
                    console.warn(`⚠️ Skipping ProgramAreaJobTitle row because job title "${jobTitleName}" does not exist yet`)
                    continue
                }

                rowsToInsert.push({
                    program_area_id: programAreaId,
                    job_title_id: jobTitleId
                })
            }
        }
    }

    await prismaClient.programAreaJobTitle.createMany({data: rowsToInsert})
}
