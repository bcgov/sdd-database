import {PrismaClient} from "@prisma/client"

export async function seedBranches(prismaClient: PrismaClient) {

    const branchNames = [
        "Community Integration Services",
        "Prevention and Loss Management Services",
        "Community Services",
        "Strategic Services",
        "Virtual Services",
        "Operations Support",
        "Office of the ADM",
        "Non SDD",
    ]

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
