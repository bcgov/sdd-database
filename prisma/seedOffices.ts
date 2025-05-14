import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main() {

    await prisma.office.deleteMany();

    await prisma.office.createMany(
        {
            data: [
                {
                    office_number: "3",
                    office_name: "Vancouver - Prevention and Loss Management Services",
                    postal_code: "V3V5V9"
                },
                {
                    office_number: "200",
                    office_name: "Vancouver Coastal Office",
                    postal_code: "V6E3S7",
                    notes: "18th/19th Floor - shared office with ISD/ELMSD/MCF\n" +
                        "LWS Site"
                },
                {
                    office_number: "333",
                    office_name: "Hope",
                    postal_code: "V0X1L0",
                    notes: "File HUB located here\n" +
                        "(page 2 of floor plan)"
                }
            ],
        }
    )
}

main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });

