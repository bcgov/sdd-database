import {PrismaClient, Employee, Workstation} from "@prisma/client";

const prisma = new PrismaClient();

export async function addNewEmployee(employee: Employee) {
    await prisma.employee.create({
        data: {
            ...employee
        },
    })
}

export async function addNewWorkstation(workstation: Workstation) {
    await prisma.workstation.create({
        data: {
            ...workstation
        }
    })
}

export async function getEmployeesByFilter(query?: string) {
    if (!query)
        return prisma.employee.findMany()

    return prisma.employee.findMany({
        where: {
            OR: [
                {employee_id: {contains: query}},
                {first_name: {contains: query, mode: 'insensitive'}},
                {middle_name: {contains: query, mode: 'insensitive'}},
                {last_name: {contains: query, mode: 'insensitive'}},
                {office_number: {contains: query}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        }
    })
}

export async function getOfficesByFilter(query?: string) {
    if (!query)
        return prisma.office.findMany()

    return prisma.office.findMany({
        where: {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {office_name: {contains: query, mode: 'insensitive'}},
                {postal_code: {contains: query, mode: 'insensitive'}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        }
    })
}

export async function getWorkstationsByFilter(query?: string) {
    if (!query)
        return prisma.workstation.findMany()

    return prisma.workstation.findMany({
        where: {
            OR: [
                {asset_tag: {contains: query, mode: 'insensitive'}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        }
    })
}

export async function updateEmployee(employee: Employee) {
    const {employee_id, ...updatableFields} = employee

    return prisma.employee.update({
        where: {employee_id},
        data: {...updatableFields},
    })
}

export async function updateOffice(office_number: string, notes: string | null) {
    return prisma.office.update({
        where: {office_number},
        data: {notes}
    })
}

export async function deleteEmployee(employee_id: string) {
    return prisma.employee.delete({
        where: {employee_id},
    })
}
