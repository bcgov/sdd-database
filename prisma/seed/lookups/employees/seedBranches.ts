import {PrismaClient} from "@/generated/prisma/client"


const BRANCHES = [
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
        data: BRANCHES.map(name => ({name}))
    })
}
