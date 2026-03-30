import {prisma} from "@/db/client";


export async function getWorkspacesByFilter(query?: string) {
    if (!query)
        return prisma.workspace.findMany()

    return prisma.workspace.findMany({
        where: {
            OR: [
                {office_number: {contains: query, mode: 'insensitive'}},
                {workspace_number: {contains: query, mode: 'insensitive'}},
            ]
        }
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
        }
    })
}
