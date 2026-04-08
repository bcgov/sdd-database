import {Prisma} from "@/generated/prisma/client";


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
