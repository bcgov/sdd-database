import {prisma} from "@/db/client";
import {workspaceWithAssignedEmployeeArgs} from "@/db/data-access/shared";


export async function getWorkspacesByFilter(query?: string) {
    if (!query)
        return prisma.workspace.findMany(workspaceWithAssignedEmployeeArgs);

    return prisma.workspace.findMany({
        where: {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {workspace_number: {contains: query, mode: 'insensitive'}},
            ]
        },
        ...workspaceWithAssignedEmployeeArgs
    })
}

export async function getAssignableWorkspacesByFilter(officeNumber: string, query?: string) {
    return prisma.workspace.findMany({
        where: {
            office_number: officeNumber,
            employee_id: null,
            ...(query
                ? {
                    workspace_number: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
                : {})
        },
        orderBy: {
            workspace_number: "asc"
        },
        // this should be null
        // However, adding this to align with type Entity
        ...workspaceWithAssignedEmployeeArgs
    })
}
