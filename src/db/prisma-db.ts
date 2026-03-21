import {prisma} from "./client";

import type {Workstation} from "@/generated/prisma/client";
import {EmployeeFormValues, EmployeeSearchResult} from "@/types";


export async function addNewEmployee(employee: EmployeeFormValues) {
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

export async function getOfficeTypes() {
    return prisma.officeType.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getTypesOfClientServices() {
    return prisma.typeOfClientService.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getEmployeesByFilter(query?: string): Promise<EmployeeSearchResult[]> {
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
                {employee_id: {contains: query, mode: 'insensitive'}},
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
                {office_type: {name: {contains: query, mode: 'insensitive'}}},
                {client_service_type: {name: {contains: query, mode: 'insensitive'}}},
                {address: {contains: query, mode: 'insensitive'}},
                {city: {contains: query, mode: 'insensitive'}},
                {postal_code: {contains: query, mode: 'insensitive'}},
            ]
        }
    })
}

export async function getWorkspacesByFilter(query?: string) {
    if(!query)
        return prisma.workspace.findMany()

    return prisma.workspace.findMany({
        where: {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {workspace_number: {contains: query, mode: 'insensitive'}},
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

export async function updateEmployee(employee: EmployeeFormValues) {

    if(employee.id === undefined) {
        throw new Error("Didn't find the employee primary key id. Can't update employee")
    }

    const existingEmployee = await prisma.employee.findUnique({
        where: {
            id: employee.id,
        },
        select: {
            employee_id: true,
            idir: true,
        }
    })

    if(!existingEmployee) {
        throw new Error(`Employee with id ${employee.id} not found`)
    }

    // employee_id and idir are immutable once set.
    // If currently missing in DB, they may be added later.
    const {id, employee_id, idir, ...rest} = employee

    // we don't update employee_id and idir if existing employee already has them set
    const data = {
        ...rest,
        ...(existingEmployee.employee_id ? {} : {employee_id}),
        ...(existingEmployee.idir ? {} : {idir}),
    }

    return prisma.employee.update({
        where: {id},
        data,
    })
}

export async function updateWorkstation(workstation: Workstation) {

    const {asset_tag, ...updatableFields} = workstation

    return prisma.workstation.update({
        where: {asset_tag},
        data: {...updatableFields}
    })
}

export async function deleteEmployee(id: number) {
    return prisma.employee.delete({
        where: {id},
    })
}
