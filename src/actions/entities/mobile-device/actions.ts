"use server";

import {createEntityActions} from "@/actions/createEntityActions";
import {parseMobileDeviceFormData} from "@/utils";
import {validateMobileDeviceData} from "@/actions/entities/mobile-device/rules";
import {
    addNewMobileDeviceWithPlanAssignment,
    getAssignableMobileDevicesByFilter,
    getMobileDevicesByFilter,
    updateMobileDeviceWithPlanAssignment
} from "@/db/data-access/mobileDevices";
import {getReadablePrismaError} from "@/actions/entities/mobile-device/errors";
import {EntityActionResult, MobileDeviceEntity} from "@/types";
import {attachEntityType} from "@/actions/attachEntityType";


export async function searchMobileDevicesAction(query?: string): Promise<MobileDeviceEntity[]> {
    const mobileDeviceSearchResults = await getMobileDevicesByFilter(query)

    // Attaching the discriminant 'type'
    return attachEntityType(mobileDeviceSearchResults, "mobileDevice")
}

export async function searchAssignableMobileDevicesAction(query?: string): Promise<MobileDeviceEntity[]> {
    const mobileDeviceSearchResults = await getAssignableMobileDevicesByFilter(query)

    // Attaching discriminant 'type'
    return attachEntityType(mobileDeviceSearchResults, "mobileDevice")
}

const mobileDeviceActions = createEntityActions({
    parse: parseMobileDeviceFormData,
    validate: validateMobileDeviceData,
    persist: {
        create: addNewMobileDeviceWithPlanAssignment,
        update: updateMobileDeviceWithPlanAssignment
    },
    getReadablePrismaError
})

export async function addNewMobileDeviceAction(prevState: EntityActionResult, formData: FormData) {
    return mobileDeviceActions.addAction(prevState, formData)
}

export async function updateMobileDeviceAction(prevState: EntityActionResult, formData: FormData) {
    return mobileDeviceActions.updateAction(prevState, formData)
}
