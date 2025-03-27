"use server";

import {Entity} from "@/types/Entity";

import {searchEmployeesAction} from "@/actions/employees";
import {searchOfficesAction} from "@/actions/offices";
import {searchWorkstationsAction} from "@/actions/workstations";


export async function searchAllAction(query?: string): Promise<Entity[]> {
    const [employeeSearchResults, officeSearchResults, workstationSearchResults] = await Promise.all([
        searchEmployeesAction(query),
        searchOfficesAction(query),
        searchWorkstationsAction(query),
    ])

    return [...employeeSearchResults, ...officeSearchResults, ...workstationSearchResults];
}
