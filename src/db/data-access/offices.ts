import {prisma} from "@/db/client";
import type {Office} from "@/generated/prisma/client";


export async function getOfficesByFilter(query?: string): Promise<Office[]> {
    if (!query)
        return prisma.office.findMany()

    return prisma.office.findMany({
        where: {
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
