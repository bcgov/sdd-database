import {Prisma} from "@/generated/prisma/client"
import {prisma} from "@/db/client";
import {workstationSearchResultArgs} from "@/db/data-access/shared";


export async function getWorkstationsByAssetTags(assetTags: string[]) {
    if (assetTags.length === 0) return []

    return prisma.workstation.findMany({
        where: {
            asset_tag: {
                in: assetTags,
            }
        }
    })
}

export async function getWorkstationsByFilter(query?: string) {

    const searchFilter: Prisma.WorkstationWhereInput = query
        ? {
            OR: [
                {asset_tag: {contains: query, mode: 'insensitive'}},
                {workstation_model: {name: {contains: query, mode: 'insensitive'}}},
                {notes: {contains: query, mode: 'insensitive'}},
                {
                    // find workstations whose assigned employee exists and matches at least one of these
                    // employee-field filters
                    assigned_employee: {
                        is: {
                            OR: [
                                {idir: {contains: query, mode: 'insensitive'}},
                                {first_name: {contains: query, mode: 'insensitive'}},
                                {alternate_name: {contains: query, mode: 'insensitive'}},
                                {last_name: {contains: query, mode: 'insensitive'}},
                            ]
                        }
                    }
                }
            ]
        }
        : {}

    return prisma.workstation.findMany({
        where: searchFilter,
        ...workstationSearchResultArgs,
    })
}

export async function getAssignableWorkstationsByFilter(query?: string) {

    const searchFilter: Prisma.WorkstationWhereInput = query
        ? {
            asset_tag: {contains: query, mode: 'insensitive'},
        }
        : {}

    return prisma.workstation.findMany({
        where: {
            employee_id: null,
            ...searchFilter
        },
        orderBy: {
            asset_tag: "asc"
        },
        ...workstationSearchResultArgs,
    })
}
