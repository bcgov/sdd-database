"use server";

import {addNewEmployee} from "@/prisma-db";
import {redirect} from "next/navigation";

export async function createNewEmployee(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const employeeId = formData.get("employeeId") as string;

    await addNewEmployee(firstName, employeeId);

    redirect("/employees-db");
}