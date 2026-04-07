import {prisma} from "@/db/client";


const lookupOptionSelect = {
    id: true,
    name: true
} as const

export async function getBranches() {
    return prisma.branch.findMany({
        select: lookupOptionSelect,
        orderBy: {
            name: "asc"
        }
    })
}

export async function getProgramAreasByBranch(branch_id: number) {
    return prisma.programArea.findMany({
        where: {branch_id},
        select: lookupOptionSelect,
        orderBy: {
            name: "asc"
        }
    })
}

export async function getBranchNameByProgramAreaId(program_area_id: number) {
    const programArea = await prisma.programArea.findUnique({
        where: { id: program_area_id },
        select: {
            branch: {
                select: {
                    name: true
                }
            }
        }
    })

    return programArea?.branch.name ?? null
}

export async function getJobTitlesByProgramArea(program_area_id: number) {
    const rows = await prisma.programAreaJobTitle.findMany({
        where: {program_area_id},
        select: {
            job_title: {
                select: lookupOptionSelect
            }
        },
        orderBy: {
            job_title: {
                name: "asc"
            }
        }
    })

    return rows.map(row => ({
        id: row.job_title.id,
        name: row.job_title.name
    }))
}

export async function getOfficeTypes() {
    return prisma.officeType.findMany({
        select: lookupOptionSelect,
        orderBy: {
            name: "asc"
        }
    })
}

export async function getTypesOfClientServices() {
    return prisma.typeOfClientService.findMany({
        select: lookupOptionSelect,
        orderBy: {
            name: "asc"
        }
    })
}
