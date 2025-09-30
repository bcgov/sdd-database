import {PrismaClient} from "@prisma/client"

const programsByBranch: Record<string, string[]> = {
    "Community Integration Services": [
        "Service Delivery",
        "Practice And Performance",
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
        "Finance, Contracts And Records Management",
        "Recruitment, Staffing, Facilities, And Assets",
        "Executive Director",
        "Analytics And Business Intelligence",
        "Communications Engagement And Organizational Health",
    ],
    "Prevention and Loss Management Services": [
        "Criminal Investigation Unit",
        "Operations",
        "Program Integrity & Evaluation",
        "Executive Director",
    ],
    "Strategic Services": [
        "Strategic Partnerships And Communications",
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
        "Children And Family Development",
        "Citizens' Services",
        "Forests",
        "Health",
        "Housing And Municipal Affairs",
        "Post-Secondary Education And Future Skills",
        "Public Safety And Solicitor General",
        "SDPR - AD",
        "SDPR - ADMO",
        "SDPR - CSD",
        "SPDR - DMO",
        "SDPR - ELMSD",
        "SDPR - FASB",
        "SDPR - ISD",
        "SDPR - RIPD",
        "SDPR - Strategic Human Resources",
        "Transportation And Transit",
        "Water, Land and Resource Stewardship",
        "Other",
    ],
};

export async function seedProgramAreas(prismaClient: PrismaClient) {
    for (const [branchName, programAreas] of Object.entries(programsByBranch)) {

        const branch = await prismaClient.branch.findUnique({
            where: { name: branchName },
        })

        if (!branch) {
            console.warn(`⚠️ Skipping branch ${branchName} because it doesn't exist yet.`);
            continue;
        }

        await Promise.all(
            programAreas.map( programArea =>
            prismaClient.programArea.upsert({
                where: {
                    //  Prisma-generated synthetic name for the unique constraint [branch_id, name]
                    branch_id_name: {
                        branch_id: branch.id,
                        name: programArea
                    }
                },
                update: {},
                create: {
                    name: programArea,
                    branch_id: branch.id
                }
            })
        ))
    }
}
