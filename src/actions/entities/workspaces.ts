"use server";

import {getAssignableWorkspacesByFilter, getWorkspacesByFilter} from "@/db/data-access/workspaces";
import {Entity} from "@/types";


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
