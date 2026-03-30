import {prisma} from "./client";

import type {Workstation} from "@/generated/prisma/client";
import {EmployeeFormValues, EmployeeSearchResult} from "@/types";


async function addNewEmployee(employee: EmployeeFormValues) {

    const {
        id,
        ui_branch_id,
        ui_workspace_number,
        ...employeeDbFields
    } = employee

    return prisma.employee.create({
        data: employeeDbFields
    })
}

export async function addNewEmployeeWithWorkspace(employee: EmployeeFormValues) {
    const createdEmployee = await addNewEmployee(employee);

    await syncEmployeeWorkspace(
        createdEmployee.id,
        employee.office_number,
        employee.ui_workspace_number
    )

    return createdEmployee
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
        return prisma.employee.findMany({
            include: {
                program_area: true,
                workspace: true
            }
        })    // hydrate ProgramArea

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
            program_area: true,
            workspace: true
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
    if (!query)
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

export async function getAssignableWorkspacesByFilter(officeNumber: string, query?: string) {
    return prisma.workspace.findMany({
        where: {
            office_number: officeNumber,
            employee_id: null,
            ...(query
                ? {
                    workspace_number: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
                : {})
        },
        orderBy: {
            workspace_number: "asc"
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

async function updateEmployee(employee: EmployeeFormValues) {

    if (employee.id === undefined) {
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

    if (!existingEmployee) {
        throw new Error(`Employee with id ${employee.id} not found`)
    }

    // employee_id and idir are immutable once set.
    // If currently missing in DB, they may be added later.
    const {
        id,
        employee_id,
        idir,
        // we extract ui_branch_id and ui_workspace_number to ignore them
        ui_branch_id,
        ui_workspace_number,
        ...rest
    } = employee

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

export async function updateEmployeeWithWorkspace(employee: EmployeeFormValues) {
    const updatedEmployee = await updateEmployee(employee)

    await syncEmployeeWorkspace(
        updatedEmployee.id,
        employee.office_number,
        employee.ui_workspace_number
    )

    return updatedEmployee
}

async function syncEmployeeWorkspace(
    employeeId: number,
    officeNumber: string,
    workspaceNumber?: string
) {
    await prisma.$transaction(async (tx) => {
        // Clear any existing workspace currently assigned to this employee
        await tx.workspace.updateMany({
            where: {
                employee_id: employeeId,
            },
            data: {
                employee_id: null,
            }
        })

        // Assign the requested workspace, if one was selected
        if (workspaceNumber) {
            await tx.workspace.update({
                where: {
                    office_number_workspace_number: {
                        office_number: officeNumber,
                        workspace_number: workspaceNumber,
                    }
                },
                data: {
                    employee_id: employeeId,
                }
            })
        }
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
