"use server";

import {EntityActionResult, MobilePlanEntity} from "@/types";
import {
    addNewMobilePlan,
    getMobilePlansByFilter
} from "@/db/data-access/mobilePlans";
import {attachEntityType} from "@/actions/attachEntityType";
import {createEntityAction} from "@/actions/createEntityActions";
import {parseMobilePlanFormData} from "@/utils";
import {validateMobilePlanData} from "@/actions/entities/mobile-plan/rules";
import {getReadablePrismaError} from "@/actions/entities/mobile-plan/errors";


export async function searchMobilePlansAction(query?: string): Promise<MobilePlanEntity[]>
{
    const mobilePlanSearchResults = await getMobilePlansByFilter(query)

    return attachEntityType(mobilePlanSearchResults, "mobilePlan")
}

const addMobilePlan = createEntityAction({
    parse: parseMobilePlanFormData,
    validate: validateMobilePlanData,
    persist: addNewMobilePlan,
    getReadablePrismaError
})

export async function addNewMobilePlanAction(
    prevState: EntityActionResult,
    formData: FormData
) {
    return addMobilePlan(prevState, formData)
}
