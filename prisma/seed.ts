import {PrismaClient} from "@prisma/client"

import {seedOffices} from "./seedOffices"
import {seedBranches} from "./seedBranches"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Starting seed...");

    await seedOffices(prisma);
    await seedBranches(prisma);

    console.log("✅ Seeding complete");
}

main()
    .catch(async error => {
        console.error("❌ Error while seeding:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect()
    })