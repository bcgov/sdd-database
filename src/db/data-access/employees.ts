import {prisma} from "@/db/client";
import {EmployeeFormValues, EmployeeSearchResult} from "@/types";
import {employeeWithRelationsArgs} from "@/db/data-access/shared";


async function addNewEmployee(employee: EmployeeFormValues) {

    const {
        id,
        ui_branch_id,
        ui_workspace_number,
        ohs_accommodation_type_ids,
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

    await syncEmployeeOhsAccommodations(
        createdEmployee.id,
        employee.ohs_accommodation_type_ids
    )

    return createdEmployee
}

export async function getEmployeesByFilter(query?: string): Promise<EmployeeSearchResult[]> {
    if (!query)
        return prisma.employee.findMany({
            ...employeeWithRelationsArgs
        })

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
                {
                    ohs_accommodations: {
                        some: {
                            ohs_accommodation_type: {
                                name: {contains: query, mode: 'insensitive'}
                            }
                        }
                    }
                }
            ]
        },
        ...employeeWithRelationsArgs
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
        // we extract the following to ignore them
        ui_branch_id,
        ui_workspace_number,
        ohs_accommodation_type_ids,
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

    await syncEmployeeOhsAccommodations(
        updatedEmployee.id,
        employee.ohs_accommodation_type_ids
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

/**
 * Replace all OHS accommodation join rows for the given employee with the currently selected accommodation type ids.
 * @param employeeId
 * @param ohsAccommodationTypeIds
 */
async function syncEmployeeOhsAccommodations(
    employeeId: number,
    ohsAccommodationTypeIds: number[],
) {

    // This removes all existing OHS rows for that employee.
    await prisma.employeeOhsAccommodation.deleteMany({
        where: {
            employee_id: employeeId,
        }
    })

    // if user selected nothing, stop
    if (ohsAccommodationTypeIds.length === 0) return

    // recreate selected rows
    await prisma.employeeOhsAccommodation.createMany({
        data: ohsAccommodationTypeIds.map(ohsAccommodationTypeId => ({
            employee_id: employeeId,
            ohs_accommodation_type_id: ohsAccommodationTypeId,
        }))
    })
}

export async function deleteEmployee(id: number) {
    return prisma.employee.delete({
        where: {id},
    })
}
