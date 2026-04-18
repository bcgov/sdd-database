import {Prisma} from "@/generated/prisma/client"
import {prisma} from "@/db/client";
import {workstationWithAssignedEmployeeArgs} from "@/db/data-access/shared";


export async function getWorkstationsByFilter(query?: string) {

    const searchFilter: Prisma.WorkstationWhereInput = query
        ? {
            OR: [
                {asset_tag: {contains: query, mode: 'insensitive'}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        }
        : {}

    return prisma.workstation.findMany({
        where: searchFilter,
        ...workstationWithAssignedEmployeeArgs,
    })
}
