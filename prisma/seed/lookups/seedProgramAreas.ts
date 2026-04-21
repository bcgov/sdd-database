import {PrismaClient} from "@/generated/prisma/client"
import {buildIdLookupByName, idNameSelect} from "../shared/lookups";


const PROGRAM_AREAS_BY_BRANCH: Record<string, string[]> = {
    "Community Integration Services": [
        "Executive Director",
        "Practice and Performance",
        "Service Delivery",
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
        "Analytics and Business Intelligence",
        "Communications Engagement and Organizational Health",
        "Executive Director",
        "Finance, Contracts and Records Management",
        "Recruitment, Staffing, Facilities, and Assets",
    ],
    "Prevention and Loss Management Services": [
        "Criminal Investigation Unit",
        "Executive Director",
        "Operations",
        "Program Integrity and Evaluation",
    ],
    "Strategic Services": [
        "Executive Director",
        "Knowledge Management",
        "Strategic Partnerships and Communications",
        "Strategic Projects and Technology Integration",
    ],
    "Virtual Services": [
        "Contact Centre",
        "Executive Director",
        "Health and Specialized Services",
        "Intake",
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

    const branchLookup = buildIdLookupByName(
        await prismaClient.branch.findMany({
            select: idNameSelect
        })
    )

    const rowsToInsert: Array<{
        name: string
        branch_id: number
    }> = []

    for (const [branchName, programAreas] of Object.entries(PROGRAM_AREAS_BY_BRANCH)) {

        const branchId = branchLookup.get(branchName)

        if (!branchId) {
            console.warn(`⚠️ Skipping branch ${branchName} because it doesn't exist yet.`);
            continue;
        }

        for (const programAreaName of programAreas) {
            rowsToInsert.push({
                name: programAreaName,
                branch_id: branchId
            })
        }
    }

    await prismaClient.programArea.createMany({data: rowsToInsert})
}
