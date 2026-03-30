import {prisma} from "@/db/client";


export async function getBranches() {
    return prisma.branch.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getProgramAreasByBranch(branch_id: number) {
    return prisma.programArea.findMany({
        where: {branch_id},
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getOfficeTypes() {
    return prisma.officeType.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}

export async function getTypesOfClientServices() {
    return prisma.typeOfClientService.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc"
        }
    })
}
