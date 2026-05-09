import {Prisma} from "@/generated/prisma/client"
import {prisma} from "@/db/client";
import {WorkspaceSearchResult} from "@/types";
import {workspaceSearchResultArgs} from "@/db/data-access/searchResultArgs";
import {buildAssignedEmployeeSearchFilter} from "@/db/data-access/searchFilters";


export async function getWorkspaceByOfficeAndWorkspaceNumber(
    officeNumber: string,
    workspaceNumber: string,
) {
    return prisma.workspace.findUnique({
        where: {
            office_number_workspace_number: {
                office_number: officeNumber,
                workspace_number: workspaceNumber,
            }
        }
    })
}

export async function getWorkspacesByFilter(query?: string): Promise<WorkspaceSearchResult[]> {

    const searchFilter: Prisma.WorkspaceWhereInput = query
        ? {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {workspace_number: {contains: query, mode: 'insensitive'}},
                {category: {name: {contains: query, mode: 'insensitive'}}},
                {desk_type: {name: {contains: query, mode: 'insensitive'}}},
                buildAssignedEmployeeSearchFilter(query)
            ]
        }
        : {}

    return prisma.workspace.findMany({
        where: searchFilter,
        ...workspaceSearchResultArgs
    })
}

export async function getAssignableWorkspacesByFilter(
    employeeOfficeNumber: string,
    employeeProgramAreaId: number,
    query?: string
): Promise<WorkspaceSearchResult[]> {

    const searchFilter: Prisma.WorkspaceWhereInput = query
        ? {
            OR: [
                {workspace_number: {contains: query, mode: 'insensitive'}},
                {category: {name: {contains: query, mode: 'insensitive'}}},
                {desk_type: {name: {contains: query, mode: 'insensitive'}}},
            ],
        }
        : {}

    return prisma.workspace.findMany({
        where: {
            office_number: employeeOfficeNumber,
            employee_id: null,
            is_on_hold: false,
            OR: [
                {restricted_program_area_id: null},
                {restricted_program_area_id: employeeProgramAreaId},
            ],
            ...searchFilter
        },
        /**
         * assigned_employee should be null
         * Other included relations like category, desk_type and restrictions are still needed for display and to
         * align with the WorkspaceSearchResult / Entity shape
         */
        ...workspaceSearchResultArgs,
        orderBy: {
            workspace_number: "asc"
        }
    })
}

export async function hold(
    officeNumber: string,
    workspaceNumber: string,
) {
    const workspace = await getWorkspaceByOfficeAndWorkspaceNumber(
        officeNumber,
        workspaceNumber,
    )

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
    const workspace = await getWorkspaceByOfficeAndWorkspaceNumber(
        officeNumber,
        workspaceNumber,
    )

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
