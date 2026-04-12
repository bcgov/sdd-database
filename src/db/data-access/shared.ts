import {Prisma} from "@/generated/prisma/client";


export const employeeWithRelationsArgs = {
    include: {
        program_area: true,
        workspace: true,
        ohs_accommodations: {
            include: {
                ohs_accommodation_type: true,
            }
        }
    }
} satisfies Prisma.EmployeeDefaultArgs

export const workspaceWithAssignedEmployeeArgs =
    {
        include: {
            category: true,
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
