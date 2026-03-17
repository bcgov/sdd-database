import {PrismaClient} from "@/generated/prisma/client"
import {branchNames} from "./constants";


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
