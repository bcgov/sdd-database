import {PrismaClient} from "@/generated/prisma/client";


const typesOfClientServices = [
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
        data: typesOfClientServices.map(name => ({name}))
    })
}
