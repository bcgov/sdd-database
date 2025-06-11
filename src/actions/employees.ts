"use server";

import {Prisma, Employee} from "@prisma/client"

import {addNewEmployee, getEmployeesByFilter, updateEmployee, deleteEmployee} from "@/prisma-db";

import {Entity} from "@/types/Entity";


interface AddNewEmployeeResult {
    success: boolean;
    error?: string;
}

export async function addNewEmployeeAction(employee: Employee): Promise<AddNewEmployeeResult> {

    // server-side validation
    const validationError = validateEmployeeData(employee);

    if(validationError) {
        return {
            success: false,
            error: validationError
        };
    }

    try {
        await addNewEmployee(employee);

        return {success: true};

    } catch (error) {

        return {
            success: false,
            error: getReadablePrismaError(error, employee)
        };
    }
}

function validateEmployeeData(employee: Employee) {

    if (!employee.first_name) {
        return "First Name is required";
    }
}

function getReadablePrismaError(error: unknown, employee: Employee) {

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        if (error.code === "P2000") {
            errorMessage = "One of the name fields (First Name, Last Name or Alternate Name) is longer than the" +
                " 30‑character limit. Please shorten it and try again."
        }

        if (error.code === "P2002") {
            let errorFieldName

            if (Array.isArray(error.meta?.target)) {
                errorFieldName = error.meta.target[0]

                if (errorFieldName === "employee_id") {
                    errorMessage = `Employee ID ${employee.employee_id} is already in use for some other employee`
                } else {
                    if (errorFieldName === "idir") {
                        errorMessage = `IDIR ${employee.idir} is already in use for some other employee`
                    }
                }
            }
        }
    }

    console.error(error);

    return errorMessage;
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
