import {PrismaClient} from "@/generated/prisma/client";

const DESK_TYPES = [
    "Height Adjustable",
    "Non-Height Adjustable",
    "Height Adjustable Accommodation",
] as const

export async function seedDeskTypes(prismaClient: PrismaClient) {
    await prismaClient.deskType.createMany({
        data: DESK_TYPES.map(name => ({name}))
    })
}
