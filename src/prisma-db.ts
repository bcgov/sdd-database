import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function createEmployee(first_name: string, employee_id: string) {
    await prisma.employee.create({
        data: {first_name, employee_id},
    })
}

export async function getEmployeesByFilter(query: string) {
    return prisma.employee.findMany({
        where: {
            OR: [
                {first_name: {contains: query, mode: 'insensitive'}},
                {employee_id: {contains: query}},
            ]
        }
    })
}