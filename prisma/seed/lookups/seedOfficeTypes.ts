import {PrismaClient} from "@/generated/prisma/client";


const OFFICE_TYPES = [
    "Community Services",
    "Contact Centre",
    "Executive Office",
    "Front Counter BC",
    "Health and Specialized Services",
    "Integration",
    "Leading Workplace Strategies",
    "MCFD",
    "Mobile Office",
    "Modernization",
    "Operations Support",
    "Prevention and Loss Management Services",
    "Regional",
    "ServiceBC",
    "Strategic Services Branch"
] as const

export async function seedOfficeTypes(prismaClient: PrismaClient) {
    await prismaClient.officeType.createMany({
        data: OFFICE_TYPES.map(name => ({name}))
    })
}
