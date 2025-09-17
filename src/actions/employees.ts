"use server";

import {Prisma, Employee} from "@prisma/client"

import {addNewEmployee, getEmployeesByFilter, updateEmployee, deleteEmployee} from "@/prisma-db";

import {EntityActionResult, Entity} from "@/types";

import {parseEmployeeFormData} from "@/utils";

import {
    validateEmployeeIdField,
    validateEmployeeIdirField,
    validateEmployeeNameField,
    validateNotesField,
    validateEmployeeOfficeNumberField,
    validateEmployeeBranchField
} from "@/validators";

import {createEntityActions} from "@/actions/createEntityActions";


function validateEmployeeData(employee: Employee) {

    return (
        validateEmployeeOfficeNumberField(employee.office_number) ??
        validateEmployeeIdirField(employee.idir) ??
        validateEmployeeNameField(employee.first_name, "First Name") ??
        (employee.alternate_name ? validateEmployeeNameField(
            employee.alternate_name,
            "Alternate Name",
            {
                required: false,
                allowMultipleWords: true
            }
        ) : undefined) ??
        validateEmployeeNameField(employee.last_name, "Last Name") ??
        validateEmployeeIdField(employee.employee_id) ??
        validateEmployeeBranchField(employee.branch_id, "Branch") ??
        (employee.notes ? validateNotesField(employee.notes) : undefined)
    )
}

function getReadablePrismaError(error: unknown, employee: Employee) {

    const base = `An unexpected error occurred. Please refresh the page and try again. If the problem persists, please contact support with the error code shown at the end and a screenshot of the entire page.`;

    let errorMessage = base;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        console.error("at start");

        const {code, meta} = error;

        console.log(`code :'${code}', message: '${error.message}'`);

        switch (code) {

            case "P2000": {

                errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: Employee ID must be exactly 6 digits long, IDIR can be upto 8 characters long, the Names (First Name, Last Name, Alternate Name) can be up to 30 characters long and Notes can be upto 2000 characters long.`;

                break;
            }
            case "P2002": {
                let errorFieldName

                if (Array.isArray(meta?.target)) {
                    errorFieldName = meta.target[0]

                    if (errorFieldName === "employee_id") {
                        errorMessage = `Employee ID '${employee.employee_id}' is already in use for some other employee`
                    } else {
                        if (errorFieldName === "idir") {
                            errorMessage = `IDIR '${employee.idir}' is already in use for some other employee`
                        }
                    }
                }

                break;
            }
            case "P2003": {
                if (meta?.constraint === "Employee_office_number_fkey") {
                    errorMessage = `It seems like an office wasn't assigned for this new employee. Please assign an office and try again.`;
                }
                else if (meta?.constraint === "Employee_branch_id_fkey") {
                    errorMessage = `It seems like a branch wasn't selected for this new employee. Please select a branch and try again.`;
                }

                break;
            }
            case "P2025": {
                const modelName = meta?.modelName ?? "record";

                errorMessage = `You are trying to edit a ${modelName} that no longer exists. Please refresh the page to get the latest list of ${modelName}s.`;

                break;
            }
            default: {
                console.log("in default")
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
