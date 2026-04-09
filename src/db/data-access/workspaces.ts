import {Prisma} from "@/generated/prisma/client"
import {prisma} from "@/db/client";
import {workspaceWithAssignedEmployeeArgs} from "@/db/data-access/shared";


export async function getWorkspacesByFilter(query?: string) {

    const searchFilter: Prisma.WorkspaceWhereInput = query
        ? {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {workspace_number: {contains: query, mode: 'insensitive'}},
                {category: {name: {contains: query, mode: 'insensitive'}}}
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
