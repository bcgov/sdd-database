import {pool, prisma} from "@/db/prisma"

import {seedOffices} from "./entities/seedOffices"
import {seedBranches} from "./entities/seedBranches"
import {seedProgramAreas} from "./entities/seedProgramAreas";
import {seedOfficeTypes} from "./entities/seedOfficeTypes";
import {seedTypesOfClientServices} from "./entities/seedTypesOfClientServices";
import {seedEmployees} from "./entities/seedEmployees";
import {seedWorkspaces} from "./entities/seedWorkspaces";
import {seedJobTitles} from "./entities/seedJobTitles";
import {seedProgramAreaJobTitles} from "./entities/seedProgramAreaJobTitles";
import {seedWorkspaceCategories} from "./entities/seedWorkspaceCategories";


async function clearSeedTables() {
    console.log("🧹 Clearing existing seed data...");

    await prisma.workspace.deleteMany()
    await prisma.workspaceCategory.deleteMany()
    await prisma.employee.deleteMany()
    await prisma.programAreaJobTitle.deleteMany()
    await prisma.jobTitle.deleteMany()
    await prisma.programArea.deleteMany()
    await prisma.branch.deleteMany()
    await prisma.office.deleteMany()
    await prisma.typeOfClientService.deleteMany()
    await prisma.officeType.deleteMany()
}

async function seedTables() {
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

    console.log("➡️ Seeding job titles...");
    await seedJobTitles(prisma);

    console.log("➡️ Seeding program area job titles...");
    await seedProgramAreaJobTitles(prisma);

    console.log("➡️ Seeding employees...");
    await seedEmployees(prisma);

    console.log("➡️ Seeding workspace categories...");
    await seedWorkspaceCategories(prisma);

    console.log("➡️ Seeding workspaces...")
    await seedWorkspaces(prisma);
}

async function main() {
    console.log("🌱 Starting seed...");

    await clearSeedTables()
    await seedTables()

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
