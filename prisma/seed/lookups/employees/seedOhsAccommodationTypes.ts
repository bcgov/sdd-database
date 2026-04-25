import type {PrismaClient} from "@/generated/prisma/client"


const OHS_ACCOMMODATION_TYPES = [
    "Chair",
    "Footrest",
    "Headset",
    "Height Adjustable Desk Accommodation",
    "Keyboard",
    "Monitor",
    "Mouse",
    
    "Other",

    "Software - Dragon",
    "Software - Jaws",
] as const

export async function seedOhsAccommodationTypes(prismaClient: PrismaClient) {
    await prismaClient.ohsAccommodationType.createMany({
        data: OHS_ACCOMMODATION_TYPES.map(name => ({name}))
    })
}
