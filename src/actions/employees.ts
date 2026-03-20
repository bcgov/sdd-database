"use server";

import {Prisma, type Employee} from "@/generated/prisma/client"

import {addNewEmployee, getEmployeesByFilter, updateEmployee, deleteEmployee} from "@/db/prisma-db";

import {EntityActionResult, Entity, EmployeeFormValues} from "@/types";

import {parseEmployeeFormData} from "@/utils";

import {
    validateEmployeeIdField,
    validateEmployeeIdirField,
    validateEmployeeNameField,
    validateNotesField,
    validateEmployeeOfficeNumberField,
    validateEmployeeProgramAreaField
} from "@/validators";

import {createEntityActions} from "@/actions/createEntityActions";


function validateEmployeeData(employee: EmployeeFormValues) {

    return (
        validateEmployeeOfficeNumberField(employee.office_number) ??
        (employee.idir ? validateEmployeeIdirField(employee.idir) : undefined) ??
        validateEmployeeNameField(employee.first_name, "First Name") ??
        (employee.alternate_name ? validateEmployeeNameField(
            employee.alternate_name,
            "Alternate Name",
            {
                required: false,
            }
        ) : undefined) ??
        validateEmployeeNameField(employee.last_name, "Last Name") ??
        (employee.employee_id ? validateEmployeeIdField(employee.employee_id) : undefined) ??
        validateEmployeeProgramAreaField(employee.program_area_id, "Program Area") ??
        (employee.notes ? validateNotesField(employee.notes) : undefined)
    )
}

type DriverAdapterErrorMeta = {
    cause?: {
        constraint?: {
            fields?: string[];
            index?: string;
        }
    }
}

function getDriverAdapterError(meta: Record<string, unknown> | undefined) {
    const dae = meta?.driverAdapterError;

    return dae && typeof dae === "object" ? (dae as DriverAdapterErrorMeta) : undefined;
}

function getReadablePrismaError(error: unknown, employee: EmployeeFormValues) {

    const base = `An unexpected error occurred. Please refresh the page and try again. If the problem persists, please contact support with the error code shown at the end and a screenshot of the entire page.`;

    let errorMessage = base;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        const {code, meta} = error;

        console.log(`code :'${code}', message: '${error.message}'`);

        switch (code) {

            case "P2000": {

                errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: Employee ID must be exactly 6 digits long, IDIR can be upto 8 characters long, the Names (First Name, Last Name, Alternate Name) can be up to 30 characters long and Notes can be upto 2000 characters long.`;

                break;
            }
            case "P2002": {

                const dae = getDriverAdapterError(meta);
                const errorFieldName = dae?.cause?.constraint?.fields?.[0];

                if (errorFieldName === "employee_id") {
                    errorMessage = `Employee ID '${employee.employee_id}' is already in use for some other employee`
                } else {
                    if (errorFieldName === "idir") {
                        errorMessage = `IDIR '${employee.idir}' is already in use for some other employee`
                    } else {
                        // fallback if we can't determine the exact field
                        errorMessage = `A record already exists with the same unique value. Please verify Employee ID and IDIR and try again.`;
                    }
                }

                break;
            }
            case "P2003": {

                const dae = getDriverAdapterError(meta);
                const foriegnKey = dae?.cause?.constraint?.index

                if (foriegnKey === "Employee_office_number_fkey") {
                    errorMessage = `It seems like an office wasn't assigned for this new employee. Please assign an office and try again.`;
                } else if (foriegnKey === "Employee_program_area_id_fkey") {
                    errorMessage = `It seems like a program area wasn't selected for this new employee. Please select a program area and try again.`;
                }
                break;
            }
            case "P2025": {
                const modelName = meta?.modelName ?? "record";

                errorMessage = `You are trying to edit a ${modelName} that no longer exists. Please refresh the page to get the latest list of ${modelName}s.`;

                break;
            }
            default: {
                errorMessage += ` Error code: "${code}"`;
            }
        }
        // If we didn’t set a specific message in the matched case, append the code as a safety net.
        if (errorMessage === base) {
            errorMessage += ` Error code: "${code}"`;
        }
    }

    console.error(error);

    return errorMessage;
}

const employeeActions = createEntityActions({
    parse: parseEmployeeFormData,
    validate: validateEmployeeData,
    persist: {
        create: addNewEmployee,
        update: updateEmployee,
    },
    getReadablePrismaError,
})

export async function addNewEmployeeAction(prevState: EntityActionResult, formData: FormData) {
    return employeeActions.addAction(prevState, formData);
}

export async function updateEmployeeAction(prevState: EntityActionResult, formData: FormData) {
    return employeeActions.updateAction(prevState, formData);
}

export async function searchEmployeesAction(query?: string): Promise<Entity[]> {
    const employeeSearchResults = await getEmployeesByFilter(query);

    // Attaching the discriminant 'type'
    const employeesWithType: Entity[] = employeeSearchResults.map(employee => ({
        ...employee,
        type: "employee" as const,
    }))

    return employeesWithType
}

export async function deleteEmployeeAction(id: number) {
    await deleteEmployee(id);
}
