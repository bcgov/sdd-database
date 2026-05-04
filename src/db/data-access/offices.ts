import {prisma} from "@/db/client";
import {Office, Prisma} from "@/generated/prisma/client";


export async function getOfficesByFilter(query?: string): Promise<Office[]> {

    const searchFilter: Prisma.OfficeWhereInput = query
        ? {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {office_name: {contains: query, mode: 'insensitive'}},
                {office_type: {name: {contains: query, mode: 'insensitive'}}},
                {client_service_type: {name: {contains: query, mode: 'insensitive'}}},
                {address: {contains: query, mode: 'insensitive'}},
                {city: {contains: query, mode: 'insensitive'}},
                {postal_code: {contains: query, mode: 'insensitive'}},
            ]
        }
        : {}

    return prisma.office.findMany({
        where: searchFilter
    })
}

export async function officeExistsByOfficeNumber(officeNumber: string) {
    const office = await prisma.office.findUnique({
        where: {
            office_number: officeNumber
        },
        select: {
            office_number: true
        }
    })

    return office !== null
}
