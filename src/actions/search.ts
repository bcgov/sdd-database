"use server";

import {Entity} from "@/types";

import {searchEmployeesAction} from "@/actions/entities/employees";
import {searchOfficesAction} from "@/actions/entities/offices";
import {searchWorkspacesAction} from "@/actions/entities/workspaces";
import {searchWorkstationsAction} from "@/actions/entities/workstations";


export async function searchAllAction(query?: string): Promise<Entity[]> {
    const [employeeSearchResults, officeSearchResults, workspaceSearchResults, workstationSearchResults] = await Promise.all([
        searchEmployeesAction(query),
        searchOfficesAction(query),
        searchWorkspacesAction(query),
        searchWorkstationsAction(query),
    ])

    return [...employeeSearchResults, ...officeSearchResults, ...workspaceSearchResults, ...workstationSearchResults];
}
