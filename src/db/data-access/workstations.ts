import {prisma} from "@/db/client";
import type {Workstation} from "@/generated/prisma/client";


export async function addNewWorkstation(workstation: Workstation) {
    return prisma.workstation.create({
        data: {
            ...workstation
        }
    })
}

export async function getWorkstationsByFilter(query?: string) {
    if (!query)
        return prisma.workstation.findMany()

    return prisma.workstation.findMany({
        where: {
            OR: [
                {asset_tag: {contains: query, mode: 'insensitive'}},
                {notes: {contains: query, mode: 'insensitive'}},
            ]
        }
    })
}

export async function updateWorkstation(workstation: Workstation) {

    const {asset_tag, ...updatableFields} = workstation

    return prisma.workstation.update({
        where: {asset_tag},
        data: {...updatableFields}
    })
}
