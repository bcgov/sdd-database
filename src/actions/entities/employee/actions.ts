"use server";

import {
  addNewEmployeeWithAssignments,
  updateEmployeeWithAssignments,
  getEmployeesByFilter,
  getEmployeesByAdvancedFilter,
  deleteEmployee,
} from "@/db/data-access/employees";

import {
  EmployeeAdvancedSearchRequest,
  EntityActionResult,
  EmployeeEntity,
} from "@/types";

import { parseEmployeeFormData } from "@/utils";

import { createEntityActions } from "@/actions/createEntityActions";
import { getReadablePrismaError } from "@/actions/entities/employee/errors";
import { validateEmployeeData } from "@/actions/entities/employee/rules";
import { attachEntityType } from "@/actions/attachEntityType";

export async function searchEmployeesAction(
  query?: string,
): Promise<EmployeeEntity[]> {
  const employeeSearchResults = await getEmployeesByFilter(query);

  // Attaching the discriminant 'type'
  return attachEntityType(employeeSearchResults, "employee");
}

export async function searchEmployeesWithAdvancedFiltersAction(
  request: EmployeeAdvancedSearchRequest,
): Promise<EmployeeEntity[]> {
  const employeeSearchResults = await getEmployeesByAdvancedFilter(request);

  return attachEntityType(employeeSearchResults, "employee");
}

const employeeActions = createEntityActions({
  parse: parseEmployeeFormData,
  validate: validateEmployeeData,
  persist: {
    create: addNewEmployeeWithAssignments,
    update: updateEmployeeWithAssignments,
  },
  getReadablePrismaError,
});

export async function addNewEmployeeAction(
  prevState: EntityActionResult,
  formData: FormData,
) {
  return employeeActions.addAction(prevState, formData);
}

export async function updateEmployeeAction(
  prevState: EntityActionResult,
  formData: FormData,
) {
  return employeeActions.updateAction(prevState, formData);
}

export async function deleteEmployeeAction(
  id: number,
): Promise<EntityActionResult> {
  try {
    await deleteEmployee(id);

    return { status: "ok" };
  } catch (error) {
    return {
      status: "error",
      error: getReadablePrismaError(error),
    };
  }
}
