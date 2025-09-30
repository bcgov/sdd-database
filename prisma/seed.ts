import {PrismaClient} from "@prisma/client"

import {seedOffices} from "./seedOffices"
import {seedBranches} from "./seedBranches"
import {seedProgramAreas} from "./seedProgramAreas";

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Starting seed...");

    console.log("➡️ Seeding offices...");
    await seedOffices(prisma);

    console.log("➡️ Seeding branches...");
    await seedBranches(prisma);

    console.log("➡️ Seeding program areas...");
    await seedProgramAreas(prisma);

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
