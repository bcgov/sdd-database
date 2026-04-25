import {PrismaClient} from "@/generated/prisma/client";

const WORKSPACE_ASSIGNMENT_TYPES = [
    "Resident",
    "Mobile",
    "Float",
    "Offsite",
    "Friendship Centre",
] as const

export async function seedWorkspaceAssignmentTypes(prismaClient: PrismaClient) {
    await prismaClient.workspaceAssignmentType.createMany({
        data: WORKSPACE_ASSIGNMENT_TYPES.map(name => ({name}))
    })
}
