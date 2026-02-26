import {PrismaClient} from "@/generated/prisma/client";


const officeTypes = [
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
]

export async function seedOfficeTypes(prismaClient: PrismaClient) {
    await Promise.all(
        officeTypes.map(officeType =>
            prismaClient.officeType.upsert({
                where: {name: officeType},
                update: {},
                create: {name: officeType},
            })
        )
    )
}
