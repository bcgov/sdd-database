import {Prisma} from "@/generated/prisma/client";


const assignedEmployeePreviewSelect = {
    idir: true,
    first_name: true,
    alternate_name: true,
    last_name: true
} satisfies Prisma.EmployeeSelect

const assignedMobileDevicePreviewSelect = {
    id: true,
    imei: true,
    mobile_device_model: {
        select: {
            name: true
        }
    }
} satisfies Prisma.MobileDeviceSelect

export const employeeSearchResultArgs = {
    include: {
        program_area: true,
        workspace_assignment_type: true,
        workspace: true,
        workstations: true,
        mobile_device: {
            select: assignedMobileDevicePreviewSelect
        },
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
                select: assignedEmployeePreviewSelect
            }
        }
    } satisfies Prisma.WorkspaceDefaultArgs

export const workstationSearchResultArgs = {
    include: {
        workstation_model: true,
        assigned_employee: {
            select: assignedEmployeePreviewSelect
        }
    }
} satisfies Prisma.WorkstationDefaultArgs

export const mobileDeviceSearchResultArgs = {
    include: {
        mobile_device_model: true,
        mobile_plan: {
            select: {
                id: true,
                phone_number: true,
                status: true
            }
        },
        assigned_employee: {
            select: assignedEmployeePreviewSelect
        }
    }
} satisfies Prisma.MobileDeviceDefaultArgs

export const mobilePlanSearchResultArgs = {
    include: {
        status: true,
        assigned_mobile_device: {
            select: assignedMobileDevicePreviewSelect
        }
    }
} satisfies Prisma.MobilePlanDefaultArgs
