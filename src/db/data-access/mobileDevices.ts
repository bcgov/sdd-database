import {MobileDeviceFormValues} from "@/types";
import {prisma} from "@/db/client";
import {MobileDevice, Prisma} from "@/generated/prisma/client";


export async function getMobileDevicesByFilter(query?: string): Promise<MobileDevice[]> {

    const searchFilter: Prisma.MobileDeviceWhereInput = query
        ? {
            OR: [
                {imei: {contains: query}},
                {office_number: {contains: query}},
            ]
        }
        : {}

    return prisma.mobileDevice.findMany({
        where: searchFilter,
        orderBy: {
            imei: "asc"
        }
    })
}

export async function addNewMobileDevice(mobileDevice: MobileDeviceFormValues) {
    return prisma.mobileDevice.create({
        data: mobileDevice
    })
}

export async function updateMobileDevice(mobileDevice: MobileDeviceFormValues) {
    if (!mobileDevice.imei) {
        throw new Error("Didn't find the IMEI. Can't update mobile device");
    }

    return prisma.mobileDevice.update({
        where: {
            imei: mobileDevice.imei
        },
        data: {
            notes: mobileDevice.notes,
            office_number: mobileDevice.office_number
        }
    })
}
