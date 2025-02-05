import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function getEmployees() {
    return prisma.employee.findMany();
}

export async function getEmployee(employee_id: string) {
    return prisma.employee.findUnique({
        where: {
            employee_id: employee_id,
        }
    })
}

export async function addNewEmployee(first_name: string, employee_id: string) {
    return prisma.employee.create({
        data: {first_name: first_name, employee_id: employee_id},
    })
}