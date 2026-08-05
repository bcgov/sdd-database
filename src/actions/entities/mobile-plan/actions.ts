"use server";

import {
  EntityActionResult,
  MobilePlanAdvancedSearchRequest,
  MobilePlanEntity,
} from "@/types";
import {
  addNewMobilePlan,
  getAssignableMobilePlansByFilter,
  getMobilePlansByAdvancedFilter,
  getMobilePlansByFilter,
  updateMobilePlan as persistMobilePlanUpdate,
} from "@/db/data-access/mobilePlans";
import { attachEntityType } from "@/actions/attachEntityType";
import { createEntityAction } from "@/actions/createEntityActions";
import {
  parseMobilePlanFormData,
  parseMobilePlanUpdateFormData,
} from "@/utils";
import {
  validateMobilePlanData,
  validateMobilePlanUpdateData,
} from "@/actions/entities/mobile-plan/rules";
import { getReadablePrismaError } from "@/actions/entities/mobile-plan/errors";

export async function searchMobilePlansAction(
  query?: string,
): Promise<MobilePlanEntity[]> {
  const mobilePlanSearchResults = await getMobilePlansByFilter(query);

  return attachEntityType(mobilePlanSearchResults, "mobilePlan");
}

export async function searchMobilePlansWithAdvancedFiltersAction(
  request: MobilePlanAdvancedSearchRequest,
): Promise<MobilePlanEntity[]> {
  const mobilePlanSearchResults = await getMobilePlansByAdvancedFilter(request);

  return attachEntityType(mobilePlanSearchResults, "mobilePlan");
}

export async function searchAssignableMobilePlansAction(
  query?: string,
): Promise<MobilePlanEntity[]> {
  const mobilePlanSearchResults = await getAssignableMobilePlansByFilter(query);

  return attachEntityType(mobilePlanSearchResults, "mobilePlan");
}

const addMobilePlan = createEntityAction({
  parse: parseMobilePlanFormData,
  validate: validateMobilePlanData,
  persist: addNewMobilePlan,
  getReadablePrismaError,
});

const updateMobilePlan = createEntityAction({
  parse: parseMobilePlanUpdateFormData,
  validate: validateMobilePlanUpdateData,
  persist: persistMobilePlanUpdate,
  getReadablePrismaError: (error) => getReadablePrismaError(error),
});

export async function addNewMobilePlanAction(
  prevState: EntityActionResult,
  formData: FormData,
) {
  return addMobilePlan(prevState, formData);
}

export async function updateMobilePlanAction(
  prevState: EntityActionResult,
  formData: FormData,
) {
  return updateMobilePlan(prevState, formData);
}
