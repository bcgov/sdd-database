import {MobileDeviceFormValues, MobileDeviceSearchResult} from "@/types";
import {prisma} from "@/db/client";
import {Prisma} from "@/generated/prisma/client";
import {mobileDeviceSearchResultArgs} from "@/db/data-access/searchResultArgs";


export async function getMobileDevicesByFilter(query?: string): Promise<MobileDeviceSearchResult[]> {

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
            where: searchFilter,
            ...mobileDeviceSearchResultArgs,
            orderBy: [
                {
                    mobile_device_model: {
                        name: "asc"
                    }
                },
                {
                    imei: "asc"
                }]
        }
    )
}

export async function addNewMobileDevice(mobileDevice: MobileDeviceFormValues) {
    const {
        id,
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

    return prisma.mobileDevice.update({
        where: {
            id: mobileDevice.id
        },
        data: {
            notes: mobileDevice.notes,
            office_number: mobileDevice.office_number
        }
    })
}
