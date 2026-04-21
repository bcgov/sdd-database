import {PrismaClient} from "@/generated/prisma/client";


const TYPES_OF_CLIENT_SERVICES = [
    "Public Facing",
    "Public Facing and Contact Centre",
    "Non-Public Facing",
    "Prevention and Loss Management Services",
    "Prevention and Loss Management Services Criminal Investigations Unit",
    "MCFD",
    "ServiceBC",
] as const

export async function seedTypesOfClientServices(prismaClient: PrismaClient) {
    await prismaClient.typeOfClientService.createMany({
        data: TYPES_OF_CLIENT_SERVICES.map(name => ({name}))
    })
}
