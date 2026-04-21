import {Prisma} from "@/generated/prisma/client";


export const employeeSearchResultArgs = {
    include: {
        program_area: true,
        workspace: true,
        workstations: true,
        ohs_accommodations: {
            include: {
                ohs_accommodation_type: true,
            }
        }
    }
} satisfies Prisma.EmployeeDefaultArgs

export const workspaceSearchResultArgs =
    {
        include: {
            category: true,
            desk_type: true,
            restricted_program_area: {
                include: {
                    branch: true,
                }
            },
            assigned_employee: {
                select: {
                    idir: true,
                    first_name: true,
                    alternate_name: true,
                    last_name: true,
                }
            }
        }
    } satisfies Prisma.WorkspaceDefaultArgs

export const workstationSearchResultArgs = {
    include: {
        workstation_model: true,
        assigned_employee: {
            select: {
                idir: true,
                first_name: true,
                alternate_name: true,
                last_name: true,
            }
        }
    }
} satisfies Prisma.WorkstationDefaultArgs
