"use server";

import {Prisma, Employee} from "@prisma/client"

import {addNewEmployee, getEmployeesByFilter, updateEmployee, deleteEmployee} from "@/prisma-db";

import {EmployeeActionResult, Entity} from "@/types";

import {parseEmployeeFormData} from "@/utils";

import {
    validateEmployeeIdField,
    validateEmployeeIdirField,
    validateEmployeeNameField,
    validateEmployeeNotesField, validateEmployeeOfficeNumberField
} from "@/validators";


function validateEmployeeData(employee: Employee) {

    return (
        validateEmployeeNameField(employee.first_name, "First Name") ??
        validateEmployeeNameField(employee.last_name, "Last Name") ??
        (employee.alternate_name && validateEmployeeNameField(employee.alternate_name, "Alternate Name", false)) ??
        validateEmployeeIdField(employee.employee_id) ??
        validateEmployeeIdirField(employee.idir) ??
        (employee.notes && validateEmployeeNotesField(employee.notes)) ??
        validateEmployeeOfficeNumberField(employee.office_number)
    )
}

function getReadablePrismaError(error: unknown, employee: Employee) {

    let errorMessage = "An unexpected error occurred";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        const {code, meta} = error;

        if (code === "P2000") {
            errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: Employee ID must be exactly 6 digits long, IDIR can be upto 8 characters long, the Names (First Name, Last Name, Alternate Name) can be up to 30 characters long and Notes can be upto 2000 characters long.`;
        }

        if (code === "P2002") {
            let errorFieldName

            if (Array.isArray(meta?.target)) {
                errorFieldName = meta.target[0]

                if (errorFieldName === "employee_id") {
                    errorMessage = `Employee ID ${employee.employee_id} is already in use for some other employee`
                } else {
                    if (errorFieldName === "idir") {
                        errorMessage = `IDIR ${employee.idir} is already in use for some other employee`
                    }
                }
            }
        }

        if (code === "P2003") {
            if (meta?.constraint === "Employee_office_number_fkey") {
                errorMessage = `It seems like an office wasn't assigned for this new employee. Please assign an office and try again.`;
            }
        }
    }

    console.error(error);

    return errorMessage;
}

type EmployeeAction = "create" | "update";

async function persistEmployee(mode: EmployeeAction, _prevState: EmployeeActionResult, formData: FormData): Promise<EmployeeActionResult> {
    const employee: Employee = parseEmployeeFormData(formData);

    // server-side validation
    const validationError = validateEmployeeData(employee);

    if (validationError) {
        return {
            status: "error",
            error: validationError
        };
    }

    try {
        if (mode === "create") {
            await addNewEmployee(employee);
        } else {
            await updateEmployee(employee);
        }

        return {status: "ok"};

    } catch (error) {

        return {
            status: "error",
            error: getReadablePrismaError(error, employee)
        };
    }
}

export const addNewEmployeeAction = persistEmployee.bind(null, "create")

export const updateEmployeeAction = persistEmployee.bind(null, "update")

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
