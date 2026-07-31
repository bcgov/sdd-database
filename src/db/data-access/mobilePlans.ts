import {
  MobilePlanFormValues,
  MobilePlanSearchResult,
  MobilePlanUpdateFormValues,
} from "@/types";
import { Prisma } from "@/generated/prisma/client";
import { mobilePlanSearchResultArgs } from "@/db/data-access/searchResultArgs";
import { prisma } from "@/db/client";
import { normalizeMobilePlanPhoneNumber } from "@/domain/mobilePlans";

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
