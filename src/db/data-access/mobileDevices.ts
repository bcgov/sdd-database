import {MobileDeviceFormValues, MobileDeviceSearchResult} from "@/types";
import {prisma} from "@/db/client";
import {Prisma} from "@/generated/prisma/client";
import {mobileDeviceSearchResultArgs} from "@/db/data-access/searchResultArgs";
import {buildAssignedEmployeeSearchFilter} from "@/db/data-access/searchFilters";
import {normalizeMobilePlanPhoneNumber} from "@/domain/mobilePlans";


export async function getMobileDeviceById(id: number) {
    return prisma.mobileDevice.findUnique({
        where: {
            id
        }
    })
}

const mobileDeviceOrderBy: Prisma.MobileDeviceOrderByWithRelationInput[] = [
    {
        mobile_device_model: {
            name: "asc"
        }
    },
    {
        imei: "asc"
    }
]

export async function getMobileDevicesByFilter(query?: string): Promise<MobileDeviceSearchResult[]> {

    const searchFilter: Prisma.MobileDeviceWhereInput = query
        ? {
            OR: [
                {imei: {contains: query}},
                {adr: {contains: query}},
                {gilr: {contains: query, mode: 'insensitive'}},
                {mobile_device_model: {name: {contains: query, mode: 'insensitive'}}},
                {office_number: {contains: query}},
                {
                    mobile_plan: {
                        phone_number: {equals: normalizeMobilePlanPhoneNumber(query)}
                    }
                },
                buildAssignedEmployeeSearchFilter(query)
            ]
        }
        :
        {}

    return prisma.mobileDevice.findMany({
        where: searchFilter,
        ...mobileDeviceSearchResultArgs,
        orderBy: mobileDeviceOrderBy
    })
}

export async function getAssignableMobileDevicesByFilter(query?: string): Promise<MobileDeviceSearchResult[]> {

    const searchFilter: Prisma.MobileDeviceWhereInput = query
        ? {
            OR: [
                {imei: {contains: query}},
                {mobile_device_model: {name: {contains: query, mode: 'insensitive'}}},
                {office_number: {contains: query}},
            ]
        }
        : {}

    return prisma.mobileDevice.findMany({
        where: {
            adr: null,
            gilr: null,
            employee_id: null,
            ...searchFilter
        },
        ...mobileDeviceSearchResultArgs,
        orderBy: mobileDeviceOrderBy
    })
}

export async function addNewMobileDevice(mobileDevice: MobileDeviceFormValues) {
    const {
        id,
        ui_mobile_device_status,
        ...mobileDeviceDbFields
    } = mobileDevice

    return prisma.mobileDevice.create({
        data: mobileDeviceDbFields
    })
}

export async function updateMobileDevice(mobileDevice: MobileDeviceFormValues) {
    if (mobileDevice.id === undefined) {
        throw new Error("Didn't find the mobile device primary key id. Can't update mobile device")
    }

    const existingMobileDevice = await prisma.mobileDevice.findUnique({
        where: {
            id: mobileDevice.id
        },
        select: {
            employee_id: true
        }
    })

    if (!existingMobileDevice) {
        throw new Error(`Mobile Device with id ${mobileDevice.id} not found`)
    }

    return prisma.mobileDevice.update({
        where: {
            id: mobileDevice.id
        },
        data: {
            adr: mobileDevice.adr,
            gilr: mobileDevice.gilr,
            notes: mobileDevice.notes,

            // Office number is manually editable only while the mobile device is unassigned
            ...(existingMobileDevice.employee_id === null
                ? {office_number: mobileDevice.office_number}
                : {})
        }
    })
}
