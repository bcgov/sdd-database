import { PrismaClient } from "@prisma/client"

export async function seedBranches(prismaClient: PrismaClient) {

    await prismaClient.branch.deleteMany()

    await prismaClient.branch.createMany({
        data: [
            { name: "Community Integration Services" },
            { name: "Prevention and Loss Management Services" },
            { name: "Community Services" },
            { name: "Strategic Services" },
            { name: "Virtual Services" },
            { name: "Operations Support" },
            { name: "Office of the ADM" },
            { name: "Non SDD" },
        ]
    })
}
