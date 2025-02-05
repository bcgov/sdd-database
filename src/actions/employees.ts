"use server";

import {createEmployee, getEmployeesByFilter} from "@/prisma-db";

export async function addNewEmployee(firstName: string, employeeId: string) {
    await createEmployee(firstName, employeeId);
}

export async function searchEmployees(query: string) {
    return await getEmployeesByFilter(query);
}