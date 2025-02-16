import {PrismaClient} from "@prisma/client";
import {Employee} from "@/types/Employee";

const prisma = new PrismaClient();

export async function createEmployee(employee: Employee) {
    await prisma.employee.create({
        data: {
            employee_id: employee.employee_id,
            first_name: employee.first_name
        },
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