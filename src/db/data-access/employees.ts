import {prisma} from "@/db/client";
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
                {job_title: {name: {contains: query, mode: 'insensitive'}}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        },
        include: {
            program_area: true,
            workspace: true
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

export async function deleteEmployee(id: number) {
    return prisma.employee.delete({
        where: {id},
    })
}
