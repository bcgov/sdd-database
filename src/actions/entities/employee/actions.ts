"use server";

import {
    addNewEmployeeWithAssignments,
    updateEmployeeWithAssignments,
    getEmployeesByFilter,
    deleteEmployee
} from "@/db/data-access/employees";

import {EntityActionResult, Entity} from "@/types";

import {parseEmployeeFormData} from "@/utils";

import {createEntityActions} from "@/actions/createEntityActions";
import {getReadablePrismaError} from "@/actions/entities/employee/errors";
import {validateEmployeeData} from "@/actions/entities/employee/rules";

const employeeActions = createEntityActions({
    parse: parseEmployeeFormData,
    validate: validateEmployeeData,
    persist: {
        create: addNewEmployeeWithAssignments,
        update: updateEmployeeWithAssignments,
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

export async function deleteEmployeeAction(id: number):Promise<EntityActionResult> {
    try {
        await deleteEmployee(id);

        return {status: "ok"}
    } catch (error) {
        return {
            status: "error",
            error: getReadablePrismaError(error)
        }
    }
}
