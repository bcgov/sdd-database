import {PrismaClient} from "@/generated/prisma/client"

const offices = [
    {
        office_number: "0",
        office_name: "Castlegar - Front Counter",
        postal_code: "V1N 1H3",
    },
    {
        office_number: "200",
        office_name: "Vancouver Coastal Office",
        postal_code: "V6E3S7",
    },
    {
        office_number: "333",
        office_name: "Hope",
        postal_code: "V0X1L0",
    },
];

export async function seedOffices(prismaClient: PrismaClient) {
    await Promise.all(
        offices.map(office =>
            prismaClient.office.upsert({
                where: {office_number: office.office_number},
                update: {
                    office_name: office.office_name,
                    postal_code: office.postal_code,
                },
                create: office,
            })
        )
    )
}
