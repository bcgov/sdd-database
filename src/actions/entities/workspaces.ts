"use server";

import {getWorkspacesByFilter} from "@/db/prisma-db";
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
