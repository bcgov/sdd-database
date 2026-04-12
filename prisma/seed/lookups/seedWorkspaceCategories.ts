import {PrismaClient} from "@prisma/client/extension";


const workspaceCategories = [
    "Point of Contact (POC)",
    "Interactive",
    "Non-Interactive",
    "Non-Interactive Office",
    "LWS Mobile",
    "Privacy Room",
] as const

export async function seedWorkspaceCategories(prismaClient: PrismaClient) {
    await prismaClient.workspaceCategory.createMany({
        data: workspaceCategories.map(name => ({name}))
    })
}
