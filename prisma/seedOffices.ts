import {PrismaClient} from "@/generated/prisma/client"

const offices = [
    {
        office_number: "0",
        office_name: "Castlegar - Front Counter",
        address: "845 Columbia Avenue",
        city: "Castlegar",
        postal_code: "V1N 1H3",
    },
    {
        office_number: "200",
        office_name: "Vancouver",
        address: "19th Floor - 1050 W Pender Street",
        city: "Vancouver",
        postal_code: "V6E 3S7",
    },
    {
        office_number: "333",
        office_name: "Hope",
        address: "999 Water Avenue",
        city: "Vancouver",
        postal_code: "V0X 1L0",
    },
];

export async function seedOffices(prismaClient: PrismaClient) {
    await Promise.all(
        offices.map(office =>
            prismaClient.office.upsert({
                where: {office_number: office.office_number},
                update: {
                    office_name: office.office_name,
                    address: office.address,
                    city: office.city,
                    postal_code: office.postal_code,
                },
                create: office,
            })
        )
    )
}
