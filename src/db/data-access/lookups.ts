import {prisma} from "@/db/client";


const lookupOptionSelect = {
    id: true,
    name: true
} as const

async function getLookupOptions(
    model: {
        // Is the thing you passed me compatible with a Prisma delegate that can do this kind of lookup query?
        findMany: (args: {
            select: typeof lookupOptionSelect
            orderBy: { name: "asc" }
        }) => Promise<Array<{id: number, name: string}>>
    }
) {
    return model.findMany({
        select: lookupOptionSelect,
        orderBy: {
            name: "asc"
        }
    })
}

export async function getBranches() {
    return getLookupOptions(prisma.branch)
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

export async function getOhsAccommodationTypes() {
    return getLookupOptions(prisma.ohsAccommodationType)
}

export async function getOfficeTypes() {
    return getLookupOptions(prisma.officeType)
}

export async function getTypesOfClientServices() {
    return getLookupOptions(prisma.typeOfClientService)
}
