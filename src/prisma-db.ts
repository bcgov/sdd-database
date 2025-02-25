import {PrismaClient, Employee} from "@prisma/client";

const prisma = new PrismaClient();

export async function addNewEmployee(employee: Employee) {
    await prisma.employee.create({
        data: {
            employee_id: employee.employee_id,
            first_name: employee.first_name,
            middle_name: employee.middle_name,
            last_name: employee.last_name,
            notes: employee.notes
        },
    })
}

export async function getEmployeesByFilter(query: string) {
    return prisma.employee.findMany({
        where: {
            OR: [
                {first_name: {contains: query, mode: 'insensitive'}},
                {middle_name: {contains: query, mode: 'insensitive'}},
                {last_name: {contains: query, mode: 'insensitive'}},
                {employee_id: {contains: query}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        }
    })
}

export async function updateEmployee(employee: Employee) {
    return prisma.employee.update({
        where: {employee_id: employee.employee_id},
        data: {first_name: employee.first_name, middle_name: employee.middle_name, last_name: employee.last_name, notes: employee.notes},
    })
}

export async function deleteEmployee(employee_id: string) {
    return prisma.employee.delete({
        where: {employee_id},
    })
}