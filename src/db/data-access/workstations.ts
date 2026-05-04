import {Prisma} from "@/generated/prisma/client"
import {prisma} from "@/db/client";
import {workstationSearchResultArgs} from "@/db/data-access/shared";
import {WorkstationFormValues, WorkstationSearchResult} from "@/types";


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

export async function getWorkstationsByFilter(query?: string): Promise<WorkstationSearchResult[]> {

    const searchFilter: Prisma.WorkstationWhereInput = query
        ? {
            OR: [
                {asset_tag: {contains: query, mode: 'insensitive'}},
                {workstation_model: {name: {contains: query, mode: 'insensitive'}}},
                {office_number: {contains: query}},
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
        orderBy: {
            asset_tag: "asc"
        }
    })
}

export async function getAssignableWorkstationsByFilter(query?: string): Promise<WorkstationSearchResult[]> {

    const searchFilter: Prisma.WorkstationWhereInput = query
        ? {
            OR: [
                {asset_tag: {contains: query, mode: 'insensitive'}},
                {workstation_model: {name: {contains: query, mode: 'insensitive'}}},
                {office_number: {contains: query}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
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

export async function addNewWorkstation(workstation: WorkstationFormValues) {
    return prisma.workstation.create({
        data: workstation,
    })
}

export async function updateWorkstation(workstation: WorkstationFormValues) {
    // defensive check in case parseWorkstationData gets empty string for asset tag
    if (!workstation.asset_tag) {
        throw new Error(`Didn't find the workstation asset tag. Can't update workstation`)
    }

    const existingWorkstation = await prisma.workstation.findUnique({
        where: {
            asset_tag: workstation.asset_tag
        },
        select: {
            employee_id: true
        }
    })

    if (!existingWorkstation) {
        throw new Error(`Workstation with asset tag ${workstation.asset_tag} not found`)
    }

    return prisma.workstation.update({
        where: {
            asset_tag: workstation.asset_tag,
        },
        data: {
            notes: workstation.notes,

            // Office number is manually editable only while the workstation is unassigned
            ...(existingWorkstation.employee_id === null
                ? {office_number: workstation.office_number}
                : {})
        }
    })
}
