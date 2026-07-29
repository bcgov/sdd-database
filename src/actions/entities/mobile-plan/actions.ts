"use server";

import {MobilePlanEntity} from "@/types";
import {getMobilePlansByFilter} from "@/db/data-access/mobilePlans";
import {attachEntityType} from "@/actions/attachEntityType";


export async function searchMobilePlansAction(query?: string): Promise<MobilePlanEntity[]>
{
    const mobilePlanSearchResults = await getMobilePlansByFilter(query)

    return attachEntityType(mobilePlanSearchResults, "mobilePlan")
}
