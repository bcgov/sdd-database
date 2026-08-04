import {
  MobilePlanFormValues,
  MobilePlanSearchResult,
  MobilePlanUpdateFormValues,
} from "@/types";
import { Prisma } from "@/generated/prisma/client";
import { mobilePlanSearchResultArgs } from "@/db/data-access/searchResultArgs";
import { prisma } from "@/db/client";
import {
  DEFAULT_MOBILE_PLAN_STATUS,
  normalizeMobilePlanPhoneNumber,
} from "@/domain/mobilePlans";

export async function getMobilePlansByFilter(
  query?: string,
): Promise<MobilePlanSearchResult[]> {
  const trimmedQuery = query?.trim();

  // Phone numbers are stored as 10 digits but users may search using the displayed ###-###-#### format.
  const normalizedPhoneNumberQuery = trimmedQuery
    ? normalizeMobilePlanPhoneNumber(trimmedQuery)
    : undefined;

  const searchFilter: Prisma.MobilePlanWhereInput = trimmedQuery
    ? {
        OR: [
          {
            phone_number: {
              equals: normalizedPhoneNumberQuery,
            },
          },
          {
            service_provider: {
              name: {
                equals: trimmedQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : {};

  return prisma.mobilePlan.findMany({
    where: searchFilter,
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
  const normalizedPhoneNumberQuery = trimmedQuery
    ? normalizeMobilePlanPhoneNumber(trimmedQuery)
    : undefined;

  const searchFilter: Prisma.MobilePlanWhereInput = trimmedQuery
    ? {
        OR: [
          {
            phone_number: {
              equals: normalizedPhoneNumberQuery,
            },
          },
          {
            service_provider: {
              name: {
                equals: trimmedQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      }
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
