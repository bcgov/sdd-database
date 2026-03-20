import {PrismaClient} from "@/generated/prisma/client"


const branchNames = [
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
    await Promise.all(
        branchNames.map(branchName =>
            prismaClient.branch.upsert({
                where: {name: branchName},
                update: {},
                create: {name: branchName}
            })
        )
    )
}
