import {Prisma} from "@/generated/prisma/client"
import {prisma} from "@/db/client";
import {workspaceWithAssignedEmployeeArgs} from "@/db/data-access/shared";


export async function getWorkspacesByFilter(query?: string) {

    const searchFilter: Prisma.WorkspaceWhereInput = query
        ? {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {workspace_number: {contains: query, mode: 'insensitive'}},
                {category: {name: {contains: query, mode: 'insensitive'}}},
                {desk_type: {name: {contains: query, mode: 'insensitive'}}}
            ]
        }
        : {}

    return prisma.workspace.findMany({
        where: searchFilter,
        ...workspaceWithAssignedEmployeeArgs
    })
}

export async function getAssignableWorkspacesByFilter(officeNumber: string, query?: string) {

    const searchFilter: Prisma.WorkspaceWhereInput = query
        ? {
            OR: [
                {workspace_number: {contains: query, mode: 'insensitive'}},
                {category: {name: {contains: query, mode: 'insensitive'}}},
            ],
        }
        : {}

    return prisma.workspace.findMany({
        where: {
            office_number: officeNumber,
            employee_id: null,
            is_on_hold: false,
            ...searchFilter
        },
        orderBy: {
            workspace_number: "asc"
        },
        // this should be null
        // However, adding this to align with type Entity
        ...workspaceWithAssignedEmployeeArgs
    })
}

export async function hold(
    officeNumber: string,
    workspaceNumber: string,
) {
    const workspace = await prisma.workspace.findUnique({
        where: {
            office_number_workspace_number: {
                office_number: officeNumber,
                workspace_number: workspaceNumber
            }
        }
    })

    if (!workspace) {
        throw new Error("Workspace not found");
    }

    if (workspace.employee_id !== null) {
        throw new Error("Occupied workspaces cannot be placed on hold");
    }

    if (workspace.is_on_hold) {
        throw new Error("Workspace is already on hold");
    }

    return prisma.workspace.update({
        where: {
            office_number_workspace_number: {
                office_number: officeNumber,
                workspace_number: workspaceNumber
            }
        },
        data: {
            is_on_hold: true,
        }
    })
}

export async function removeHold(
    officeNumber: string,
    workspaceNumber: string,
) {
    const workspace = await prisma.workspace.findUnique({
        where: {
            office_number_workspace_number: {
                office_number: officeNumber,
                workspace_number: workspaceNumber
            }
        }
    })

    if (!workspace) {
        throw new Error("Workspace not found");
    }

    if (workspace.employee_id !== null) {
        throw new Error("Occupied workspaces cannot be removed from hold");
    }

    if (!workspace.is_on_hold) {
        throw new Error("Workspace is not currently on hold");
    }

    return prisma.workspace.update({
        where: {
            office_number_workspace_number: {
                office_number: officeNumber,
                workspace_number: workspaceNumber
            }
        },
        data: {
            is_on_hold: false,
        }
    })
}
