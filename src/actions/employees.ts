"use server";

import {Prisma} from "@prisma/client"
import {createEmployee, getEmployeesByFilter} from "@/prisma-db";

interface AddNewEmployeeResult {
    success: boolean;
    error?: string;
}

export async function addNewEmployee(firstName: string, employeeId: string): Promise<AddNewEmployeeResult> {
    try {
        await createEmployee(firstName, employeeId);

        return {success: true};

    } catch (error) {
        
        // Handle unique constraint violation (P2002)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {

            return {
                success: false,
                error: `Employee ID ${employeeId} is already in use for some other employee`
            };
        }
        // For other errors/error codes
        return {
            success: false,
            error: "An unexpected error occurred"
        }
    }
}

export async function searchEmployees(query: string) {
    return await getEmployeesByFilter(query);
}