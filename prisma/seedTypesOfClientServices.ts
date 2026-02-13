import {PrismaClient} from "@/generated/prisma/client";


const typesOfClientServices = [
    "Public Facing",
    "Public Facing and Contact Centre",
    "Non-Public Facing",
    "Prevention and Loss Management Services",
    "Prevention and Loss Management Services Criminal Investigations Unit",
    "MCFD",
    "ServiceBC",
]

export async function seedTypesOfClientServices(prismaClient: PrismaClient) {
    await Promise.all(
        typesOfClientServices.map(typeOfClientService =>
            prismaClient.typeOfClientService.upsert({
                where: {name: typeOfClientService},
                update: {},
                create: {name: typeOfClientService},
            })
        )
    )
}