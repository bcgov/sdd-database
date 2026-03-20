import {PrismaClient} from "@/generated/prisma/client"


const programsByBranch: Record<string, string[]> = {
    "Community Integration Services": [
        "Service Delivery",
        "Practice and Performance",
        "Executive Director",
    ],
    "Community Services": [
        "Area A Staff",
        "Area B Staff",
        "Area C Staff",
        "Executive Director",
    ],
    "Office of the ADM": [
        "Service Delivery Division",
    ],
    "Operations Support": [
        "Finance, Contracts and Records Management",
        "Recruitment, Staffing, Facilities, and Assets",
        "Executive Director",
        "Analytics and Business Intelligence",
        "Communications Engagement and Organizational Health",
    ],
    "Prevention and Loss Management Services": [
        "Criminal Investigation Unit",
        "Operations",
        "Program Integrity & Evaluation",
        "Executive Director",
    ],
    "Strategic Services": [
        "Strategic Partnerships and Communications",
        "Knowledge Management",
        "Executive Director",
        "Strategic Projects & Technology Integration",
    ],
    "Virtual Services": [
        "Intake",
        "Contact Centre",
        "Health & Specialized Services",
        "Executive Director",
    ],
    "Non SDD": [
        "Attorney General",
        "Children and Family Development",
        "Citizens' Services",
        "Forests",
        "Health",
        "Housing and Municipal Affairs",
        "Infrastructure",
        "Post-Secondary Education and Future Skills",
        "Public Safety and Solicitor General",
        "Public Service Agency",
        "SDPR - AD",
        "SDPR - ADMO",
        "SDPR - CSD",
        "SDPR - DMO",
        "SDPR - ELMSD",
        "SDPR - FASB",
        "SDPR - ISD",
        "SDPR - RIPD",
        "SDPR - Strategic Human Resources",
        "Transportation and Transit",
        "Water, Land and Resource Stewardship",
        "Other",
    ],
};

export async function seedProgramAreas(prismaClient: PrismaClient) {
    for (const [branchName, programAreas] of Object.entries(programsByBranch)) {

        const branch = await prismaClient.branch.findUnique({
            where: { name: branchName },
            select: { id: true }
        })

        if (!branch) {
            console.warn(`⚠️ Skipping branch ${branchName} because it doesn't exist yet.`);
            continue;
        }

        const rows = programAreas.map( (name) => ({name, branch_id: branch.id }))

        await prismaClient.programArea.createMany({data: rows, skipDuplicates: true})
    }
}
