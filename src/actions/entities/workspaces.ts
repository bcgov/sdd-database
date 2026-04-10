"use server";

import {
    getAssignableWorkspacesByFilter,
    getWorkspacesByFilter,
    hold,
    removeHold
} from "@/db/data-access/workspaces";
import {Entity, EntityActionResult} from "@/types";


export async function searchWorkspacesAction(query?: string) {
    const workspaceSearchResults = await getWorkspacesByFilter(query)

    // Attaching discriminant 'type'
    const workspacesWithType: Entity[] = workspaceSearchResults.map(workspace => ({
        ...workspace,
        type: "workspace" as const,
    }))

    return workspacesWithType
}

export async function searchAssignableWorkspacesAction(officeNumber: string, query?: string, ) {
    const workspaceSearchResults = await getAssignableWorkspacesByFilter(officeNumber, query)

    // Attaching discriminant 'type'
    const workspacesWithType: Entity[] = workspaceSearchResults.map(workspace => ({
        ...workspace,
        type: "workspace" as const,
    }))

    return workspacesWithType
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
