import {PrismaClient} from "@/generated/prisma/client"


const BRANCH_NAMES = [
    "Community Integration Services",
    "Prevention and Loss Management Services",
    "Community Services",
    "Strategic Services",
    "Virtual Services",
    "Operations Support",
    "Office of the ADM",
    "Non SDD",
] as const

export async function seedBranches(prismaClient: PrismaClient) {

    await prismaClient.branch.createMany({
        data: BRANCH_NAMES.map(name => ({name}))
    })
}
