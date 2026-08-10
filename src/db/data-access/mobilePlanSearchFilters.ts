import type { Prisma } from "@/generated/prisma/client";
import type { MobilePlanAdvancedSearchRequest } from "@/types";
import { normalizeMobilePlanPhoneNumber } from "@/domain/mobilePlans";
import { parseKeywordSearchQuery } from "@/db/data-access/searchFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildMobilePlanKeywordSearchFilter(
  query: string,
): Prisma.MobilePlanWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;
  const normalizedPhoneNumber = normalizeMobilePlanPhoneNumber(value);

  return {
    OR: [
      { phone_number: { equals: normalizedPhoneNumber } },
      ...(!isDigitsOnly
        ? [
            {
              service_provider: {
                name: { contains: value, mode: "insensitive" as const },
              },
            },
          ]
        : []),
    ],
  };
}

export function buildMobilePlanAdvancedSearchFilter(
  request: MobilePlanAdvancedSearchRequest,
): Prisma.MobilePlanWhereInput {
  const conditions: Prisma.MobilePlanWhereInput[] = [];
  const { filters } = request;
  const query = getTextFilterValue(request.query);

  if (query) {
    conditions.push(buildMobilePlanKeywordSearchFilter(query));
  }

  const phoneNumber = getTextFilterValue(filters.phoneNumber);
  if (phoneNumber) {
    conditions.push({
      phone_number: { equals: normalizeMobilePlanPhoneNumber(phoneNumber) },
    });
  }

  if (filters.dataAllowanceGb !== undefined) {
    conditions.push({ data_allowance_gb: filters.dataAllowanceGb });
  }

  if (filters.enhancedVoicemail !== undefined) {
    conditions.push({ enhanced_voicemail: filters.enhancedVoicemail });
  }

  if (filters.statusId !== undefined) {
    conditions.push({ status_id: filters.statusId });
  }

  if (filters.serviceProviderId !== undefined) {
    conditions.push({ service_provider_id: filters.serviceProviderId });
  }

  if (filters.isAssigned !== undefined) {
    conditions.push({
      mobile_device_id: filters.isAssigned ? { not: null } : null,
    });
  }

  const assignedMobileDeviceImei = getTextFilterValue(
    filters.assignedMobileDeviceImei,
  );
  if (assignedMobileDeviceImei) {
    conditions.push({
      assigned_mobile_device: {
        is: {
          imei: { equals: assignedMobileDeviceImei, mode: "insensitive" },
        },
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
