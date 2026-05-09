import {PrismaClient} from "@/generated/prisma/client";


const WORKSTATION_MODEL_NAMES = [
    "Apple MacBook Pro",
    "Microsoft Surface Pro 8",
    "Microsoft Surface Pro 11",
    "Lenovo ThinkPad P16",
    "Lenovo ThinkStation P360",
    "Lenovo ThinkPad T14",
    "Lenovo ThinkPad T15",
    "Lenovo ThinkPad T16",
    "Lenovo ThinkPad T580"
] as const

export async function seedWorkstationModels(prismaClient: PrismaClient) {
    await prismaClient.workstationModel.createMany({
        data: WORKSTATION_MODEL_NAMES.map(name => ({name}))
    })
}
