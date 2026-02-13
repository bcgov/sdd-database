import {PrismaClient} from "@/generated/prisma/client"


const offices = [
    {
        office_number: "0",
        office_name: "Castlegar - Front Counter",
        type_name: "Front Counter BC",
        type_of_client_service_name: "Public Facing",
        address: "845 Columbia Avenue",
        city: "Castlegar",
        postal_code: "V1N 1H3",
    },
    {
        office_number: "200",
        office_name: "Vancouver",
        type_name: "Leading Workplace Strategies",
        type_of_client_service_name: "Non-Public Facing",
        address: "19th Floor - 1050 W Pender Street",
        city: "Vancouver",
        postal_code: "V6E 3S7",
    },
    {
        office_number: "333",
        office_name: "Hope",
        type_name: "Community Services",
        type_of_client_service_name: "Public Facing",
        address: "999 Water Avenue",
        city: "Hope",
        postal_code: "V0X 1L0",
    },
];

export async function seedOffices(prismaClient: PrismaClient) {
    await Promise.all(
        offices.map(office => {

            const {office_number, type_name, type_of_client_service_name, ...rest} = office;

            const officeTypeConnect = {
                // sets the FK via relation by looking up OfficeType by unique name
                office_type: {
                    connect: { name: type_name }
                },
            }

            const typeOfClientServiceConnect = {
                client_service_type: {
                    connect: { name: type_of_client_service_name }
                }
            }

            return prismaClient.office.upsert({
                where: {office_number},

                update: {
                    ...rest,
                    ...officeTypeConnect,
                    ...typeOfClientServiceConnect
                },
                create: {
                    office_number,
                    ...rest,
                    ...officeTypeConnect,
                    ...typeOfClientServiceConnect
                },
            })
        }
        )
    )
}
