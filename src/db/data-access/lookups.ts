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

export async function getOfficeTypes() {
    return getLookupOptions(prisma.officeType)
}

export async function getTypesOfClientServices() {
    return getLookupOptions(prisma.typeOfClientService)
}

export async function getWorkspaceAssignmentTypes() {
    return getLookupOptions(prisma.workspaceAssignmentType)
}

export async function getWorkspaceAssignmentTypeNameById(id: number) {
    const workspaceAssignmentType = await prisma.workspaceAssignmentType.findUnique({
        where: {
            id
        },
        select: {
            name: true
        }
    })

    return workspaceAssignmentType?.name ?? null
}

export async function getWorkstationModels() {
    return getLookupOptions(prisma.workstationModel)
}

export async function getWorkstationModelById(id: number) {
    return prisma.workstationModel.findUnique({
        where: {
            id
        },
        select: {
            name: true
        }
    })
}

export async function getMobileDeviceModels() {
    return getLookupOptions(prisma.mobileDeviceModel)
}

export async function getMobileDeviceModelById(id: number) {
    return prisma.mobileDeviceModel.findUnique({
        where: {
            id
        },
        select: {
            name: true
        }
    })
}

export async function getMobilePlanStatuses() {
    return getLookupOptions(prisma.mobilePlanStatus)
}

export async function getMobilePlanStatusById(id: number) {
    return prisma.mobilePlanStatus.findUnique({
        where: {
            id
        },
        select: lookupOptionSelect
    })
}

export async function getMobilePlanServiceProviders() {
    return getLookupOptions(prisma.mobilePlanServiceProvider)
}

export async function getMobilePlanServiceProviderById(id: number) {
    return prisma.mobilePlanServiceProvider.findUnique({
        where: {
            id
        },
        select: lookupOptionSelect
    })
}

export async function getOhsAccommodationTypes() {
    return getLookupOptions(prisma.ohsAccommodationType)
}
