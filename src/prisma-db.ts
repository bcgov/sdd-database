import {PrismaClient, Employee, Workstation, Office} from "@prisma/client";

const prisma = new PrismaClient();

export async function addNewEmployee(employee: Employee) {
    return prisma.employee.create({
        data: {
            ...employee
        },
    })
}

export async function addNewWorkstation(workstation: Workstation) {
    return prisma.workstation.create({
        data: {
            ...workstation
        }
    })
}

export async function getBranches() {
    return prisma.branch.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getProgramAreasByBranch(branch_id: number) {
    return prisma.programArea.findMany({
        where: {branch_id},
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getEmployeesByFilter(query?: string) {
    if (!query)
        return prisma.employee.findMany({include: {program_area: true}})    // hydrate ProgramArea

    return prisma.employee.findMany({
        where: {
            OR: [
                {office_number: {contains: query}},
                {idir: {contains: query, mode: 'insensitive'}},
                {first_name: {contains: query, mode: 'insensitive'}},
                {alternate_name: {contains: query, mode: 'insensitive'}},
                {last_name: {contains: query, mode: 'insensitive'}},
                {employee_id: {contains: query}},
                // 🔎 match by Branch name via ProgramArea -> Branch using a relation filter
                {program_area: {branch: {name: {contains: query, mode: 'insensitive'}}}},
                // 🔎 match by Program Area name
                {program_area: {name: {contains: query, mode: 'insensitive'}}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        },
        include: {
            program_area: true
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

    // we don't want to update the employee_id and idir fields as those are read-only and hence the user couldn't
    // have changed them in the form
    const {employee_id, idir: _idir, ...updatableFields} = employee

    return prisma.employee.update({
        where: {employee_id},
        data: {...updatableFields},
    })
}

export async function updateOffice(office: Office) {

    const {office_number, office_name: _office_name, postal_code: _postal_code, ...updatableFields} = office

    return prisma.office.update({
        where: {office_number},
        data: {...updatableFields},
    })
}

export async function updateWorkstation(workstation: Workstation) {

    const {asset_tag, ...updatableFields} = workstation

    return prisma.workstation.update({
        where: {asset_tag},
        data: {...updatableFields}
    })
}

export async function deleteEmployee(employee_id: string) {
    return prisma.employee.delete({
        where: {employee_id},
    })
}
