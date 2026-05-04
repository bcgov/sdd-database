import {MobileDeviceFormValues} from "@/types";
import {prisma} from "@/db/client";
import {MobileDevice} from "@/generated/prisma/client";


export async function getMobileDevicesByFilter(query?: string): Promise<MobileDevice[]> {
    if (!query) {
        return prisma.mobileDevice.findMany({
            orderBy: {
                imei: "asc"
            }
        })
    }

    return prisma.mobileDevice.findMany({
        where: {
            imei: {
                contains: query
            }
        },
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

    return prisma.mobileDevice.findUniqueOrThrow({
        where: {
            imei: mobileDevice.imei
        }
    })
}
