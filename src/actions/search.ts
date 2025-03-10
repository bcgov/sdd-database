"use server";

import {Entity} from "@/types/Entity";
import {searchEmployeesAction} from "@/actions/employees";
import {searchOfficesAction} from "@/actions/offices";

export async function searchAllAction(query?: string): Promise<Entity[]> {
    const [employeeSearchResults, officeSearchResults] = await Promise.all([
        searchEmployeesAction(query),
        searchOfficesAction(query),
    ])

    return [...employeeSearchResults, ...officeSearchResults];
}
