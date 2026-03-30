import {pool, prisma} from "@/db/prisma"

import {seedOffices} from "./seedOffices"
import {seedBranches} from "./seedBranches"
import {seedProgramAreas} from "./seedProgramAreas";
import {seedOfficeTypes} from "./seedOfficeTypes";
import {seedTypesOfClientServices} from "./seedTypesOfClientServices";
import {seedEmployees} from "./seedEmployees";
import {seedWorkspaces} from "./seedWorkspaces";


async function main() {
    console.log("🌱 Starting seed...");

    console.log("➡️ Seeding office types...");
    await seedOfficeTypes(prisma);

    console.log("➡️ Seeding types of client services...");
    await seedTypesOfClientServices(prisma);

    console.log("➡️ Seeding offices...");
    await seedOffices(prisma);

    console.log("➡️ Seeding branches...");
    await seedBranches(prisma);

    console.log("➡️ Seeding program areas...");
    await seedProgramAreas(prisma);

    console.log("➡️ Seeding employees...");
    await seedEmployees(prisma);

    console.log("➡️ Seeding workspaces...")
    await seedWorkspaces(prisma);

    console.log("✅ Seeding complete");
}

main()
    .catch(async error => {
        console.error("❌ Error while seeding:", error);
        process.exit(1);
    })
    .finally(async () => {
        // close prisma client + release any DB resources help by Prisma in this seed script process
        await prisma.$disconnect()
        // close pg pool so that the Node process can exit cleanly (no hanging connections)
        await pool.end()
    })
