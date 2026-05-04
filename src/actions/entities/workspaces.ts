"use server";

import {
    getAssignableWorkspacesByFilter,
    getWorkspacesByFilter,
    hold,
    removeHold
} from "@/db/data-access/workspaces";
import {EntityActionResult, WorkspaceEntity} from "@/types";
import {attachEntityType} from "@/actions/attachEntityType";


export async function searchWorkspacesAction(query?: string): Promise<WorkspaceEntity[]>  {
    const workspaceSearchResults = await getWorkspacesByFilter(query)

    // Attaching discriminant 'type'
    return attachEntityType(workspaceSearchResults, "workspace")
}

export async function searchAssignableWorkspacesAction(
    employeeOfficeNumber: string,
    employeeProgramAreaId: number,
    query?: string
): Promise<WorkspaceEntity[]> {
    const workspaceSearchResults = await getAssignableWorkspacesByFilter(
        employeeOfficeNumber,
        employeeProgramAreaId,
        query
    )

    // Attaching discriminant 'type'
    return attachEntityType(workspaceSearchResults, "workspace")
}

export async function holdAction(
    officeNumber: string,
    workspaceNumber: string,
): Promise<EntityActionResult> {
    try {
        await hold(officeNumber, workspaceNumber)

        return {status: "ok" }
    }
    catch (error) {
        return {
            status: "error",
            error: error instanceof Error
                ? error.message
                : "Could not hold workspace"
        }
    }
}

export async function removeHoldAction(
    officeNumber: string,
    workspaceNumber: string,
): Promise<EntityActionResult> {
    try {
    await removeHold(officeNumber, workspaceNumber)
        return {status: "ok" }
    }
    catch (error) {
        return {
            status: "error",
            error: error instanceof Error
                ? error.message
                : "Could not remove workspace hold"
        }
    }
}
