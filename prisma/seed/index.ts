import {pool, prisma} from "@/db/prisma"

import {seedOffices} from "./entities/seedOffices"
import {seedBranches} from "./lookups/seedBranches"
import {seedProgramAreas} from "./lookups/seedProgramAreas";
import {seedOfficeTypes} from "./lookups/seedOfficeTypes";
import {seedTypesOfClientServices} from "./lookups/seedTypesOfClientServices";
import {seedEmployees} from "./entities/seedEmployees";
import {seedWorkspaces} from "./entities/seedWorkspaces";
import {seedJobTitles} from "./lookups/seedJobTitles";
import {seedProgramAreaJobTitles} from "./lookups/seedProgramAreaJobTitles";
import {seedWorkspaceCategories} from "./lookups/seedWorkspaceCategories";
import {seedOhsAccommodationTypes} from "./lookups/seedOhsAccommodationTypes";
import {seedEmployeeOhsAccommodations} from "./entities/seedEmployeeOhsAccommodations";
import {seedDeskTypes} from "./lookups/seedDeskTypes";
import {seedWorkstations} from "./entities/seedWorkstations";


async function clearSeedTables() {
    console.log("🧹 Clearing existing seed data...");

    await prisma.workstation.deleteMany();
    await prisma.workspace.deleteMany()
    await prisma.deskType.deleteMany()
    await prisma.workspaceCategory.deleteMany()
    await prisma.employeeOhsAccommodation.deleteMany()
    await prisma.employee.deleteMany()
    await prisma.ohsAccommodationType.deleteMany()
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

    console.log("➡️ Seeding OHS accommodation types...");
    await seedOhsAccommodationTypes(prisma);

    console.log("➡️ Seeding employees...");
    await seedEmployees(prisma);

    console.log("➡️ Seeding employee OHS accommodations...");
    await seedEmployeeOhsAccommodations(prisma);

    console.log("➡️ Seeding workspace categories...");
    await seedWorkspaceCategories(prisma);

    console.log("➡️ Seeding desk types...");
    await seedDeskTypes(prisma);

    console.log("➡️ Seeding workspaces...")
    await seedWorkspaces(prisma);

    console.log("➡️ Seeding workstations...");
    await seedWorkstations(prisma);
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
