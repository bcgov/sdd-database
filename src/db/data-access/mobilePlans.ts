import {
  MobilePlanAdvancedSearchRequest,
  MobilePlanFormValues,
  MobilePlanSearchResult,
  MobilePlanUpdateFormValues,
} from "@/types";
import { Prisma } from "@/generated/prisma/client";
import { mobilePlanSearchResultArgs } from "@/db/data-access/searchResultArgs";
import { prisma } from "@/db/client";
import { DEFAULT_MOBILE_PLAN_STATUS } from "@/domain/mobilePlans";
import {
  buildMobilePlanAdvancedSearchFilter,
  buildMobilePlanKeywordSearchFilter,
} from "@/db/data-access/mobilePlanSearchFilters";
import { hasAdvancedSearchCriteria } from "@/domain/advancedSearch";

export async function getMobilePlansByFilter(
  query?: string,
): Promise<MobilePlanSearchResult[]> {
  const trimmedQuery = query?.trim();

  const searchFilter: Prisma.MobilePlanWhereInput = trimmedQuery
    ? buildMobilePlanKeywordSearchFilter(trimmedQuery)
    : {};

  return prisma.mobilePlan.findMany({
    where: searchFilter,
    ...mobilePlanSearchResultArgs,
    orderBy: {
      phone_number: "asc",
    },
  });
}

export async function getMobilePlansByAdvancedFilter(
  request: MobilePlanAdvancedSearchRequest,
): Promise<MobilePlanSearchResult[]> {
  if (!hasAdvancedSearchCriteria(request.query, request.filters)) {
    return [];
  }

  return prisma.mobilePlan.findMany({
    where: buildMobilePlanAdvancedSearchFilter(request),
    ...mobilePlanSearchResultArgs,
    orderBy: {
      phone_number: "asc",
    },
  });
}

/**
 * Plans that may be newly linked to a mobile device. Existing links are left
 * intact when a plan later becomes suspended or cancelled, but only an active,
 * currently unassigned plan may be selected for a new assignment.
 */
export async function getAssignableMobilePlansByFilter(
  query?: string,
): Promise<MobilePlanSearchResult[]> {
  const trimmedQuery = query?.trim();
  const searchFilter: Prisma.MobilePlanWhereInput = trimmedQuery
    ? buildMobilePlanKeywordSearchFilter(trimmedQuery)
    : {};

  return prisma.mobilePlan.findMany({
    where: {
      mobile_device_id: null,
      status: {
        name: DEFAULT_MOBILE_PLAN_STATUS,
      },
      ...searchFilter,
    },
    ...mobilePlanSearchResultArgs,
    orderBy: {
      phone_number: "asc",
    },
  });
}

/**
 * Minimal server-side state used to validate a submitted plan assignment.
 */
export async function getMobilePlanAssignmentById(id: number) {
  return prisma.mobilePlan.findUnique({
    where: { id },
    select: {
      id: true,
      mobile_device_id: true,
      status: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function addNewMobilePlan(mobilePlan: MobilePlanFormValues) {
  return prisma.mobilePlan.create({
    data: mobilePlan,
  });
}

export async function updateMobilePlan(mobilePlan: MobilePlanUpdateFormValues) {
  return prisma.mobilePlan.update({
    where: {
      id: mobilePlan.id,
    },
    data: {
      data_allowance_gb: mobilePlan.data_allowance_gb,
      enhanced_voicemail: mobilePlan.enhanced_voicemail,
      status_id: mobilePlan.status_id,
    },
  });
}
