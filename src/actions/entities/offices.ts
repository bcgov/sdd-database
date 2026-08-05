"use server";

import {
  getOfficesByAdvancedFilter,
  getOfficesByFilter,
} from "@/db/data-access/offices";

import { OfficeAdvancedSearchRequest, OfficeEntity } from "@/types";
import { attachEntityType } from "@/actions/attachEntityType";

export async function searchOfficesAction(
  query?: string,
): Promise<OfficeEntity[]> {
  const officeSearchResults = await getOfficesByFilter(query);

  // Attaching the discriminant 'type'
  return attachEntityType(officeSearchResults, "office");
}

export async function searchOfficesWithAdvancedFiltersAction(
  request: OfficeAdvancedSearchRequest,
): Promise<OfficeEntity[]> {
  const officeSearchResults = await getOfficesByAdvancedFilter(request);

  return attachEntityType(officeSearchResults, "office");
}
