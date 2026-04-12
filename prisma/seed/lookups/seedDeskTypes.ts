import {PrismaClient} from "@prisma/client/extension";

const deskTypes = [
    "Height Adjustable",
    "Non-Height Adjustable",
    "Height Adjustable Accommodation",
] as const

export async function seedDeskTypes(prismaClient: PrismaClient) {
    await prismaClient.deskType.createMany({
        data: deskTypes.map(name => ({name}))
    })
}
