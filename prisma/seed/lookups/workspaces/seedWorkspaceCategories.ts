import {PrismaClient} from "@/generated/prisma/client";


const WORKSPACE_CATEGORIES = [
    "Point of Contact (POC)",
    "Interactive",
    "Non-Interactive",
    "Non-Interactive Office",
    "LWS Mobile",
] as const

export async function seedWorkspaceCategories(prismaClient: PrismaClient) {
    await prismaClient.workspaceCategory.createMany({
        data: WORKSPACE_CATEGORIES.map(name => ({name}))
    })
}
