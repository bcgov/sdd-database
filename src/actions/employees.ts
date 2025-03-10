"use server";

import {Prisma, Employee} from "@prisma/client"

import {addNewEmployee, getEmployeesByFilter, updateEmployee, deleteEmployee} from "@/prisma-db";

import {Entity} from "@/types/Entity";


interface AddNewEmployeeResult {
    success: boolean;
    error?: string;
}

export async function addNewEmployeeAction(employee: Employee): Promise<AddNewEmployeeResult> {
    try {
        await addNewEmployee(employee);

        return {success: true};

    } catch (error) {

        // Handle unique constraint violation (P2002)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {

            return {
                success: false,
                error: `Employee ID ${employee.employee_id} is already in use for some other employee`
            };
        }

        console.error(error);

        // For other errors/error codes
        return {
            success: false,
            error: "An unexpected error occurred"
        }
    }
}

export async function updateEmployeeAction(updatedEmployee: Employee) {
    await updateEmployee(updatedEmployee);
}

export async function searchEmployeesAction(query?: string) {
    const employeeSearchResults = await getEmployeesByFilter(query);

    // Attaching the discriminant 'type'
    const employeesWithType: Entity[] = employeeSearchResults.map(employee => ({
        ...employee,
        type: "employee" as const,
    }))

    return employeesWithType
}

export async function deleteEmployeeAction(employee_id: string) {
    await deleteEmployee(employee_id);
}
