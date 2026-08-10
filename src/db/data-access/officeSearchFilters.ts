import type { Prisma } from "@/generated/prisma/client";
import type { OfficeAdvancedSearchRequest } from "@/types";
import { parseKeywordSearchQuery } from "@/db/data-access/searchFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildOfficeKeywordSearchFilter(
  query: string,
): Prisma.OfficeWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;
  const descriptiveFilters: Prisma.OfficeWhereInput[] = isDigitsOnly
    ? []
    : [
        { office_name: { contains: value, mode: "insensitive" } },
        {
          office_type: {
            name: { contains: value, mode: "insensitive" },
          },
        },
        {
          client_service_type: {
            name: { contains: value, mode: "insensitive" },
          },
        },
        { address: { contains: value, mode: "insensitive" } },
        { city: { contains: value, mode: "insensitive" } },
        { postal_code: { contains: value, mode: "insensitive" } },
      ];

  return {
    OR: [
      { office_number: { equals: value, mode: "insensitive" } },
      ...descriptiveFilters,
    ],
  };
}

export function buildOfficeAdvancedSearchFilter(
  request: OfficeAdvancedSearchRequest,
): Prisma.OfficeWhereInput {
  const conditions: Prisma.OfficeWhereInput[] = [];
  const { filters } = request;
  const query = getTextFilterValue(request.query);

  if (query) {
    conditions.push(buildOfficeKeywordSearchFilter(query));
  }

  const officeNumber = getTextFilterValue(filters.officeNumber);
  if (officeNumber) {
    conditions.push({
      office_number: { equals: officeNumber, mode: "insensitive" },
    });
  }

  const officeName = getTextFilterValue(filters.officeName);
  if (officeName) {
    conditions.push({
      office_name: { contains: officeName, mode: "insensitive" },
    });
  }

  if (filters.officeTypeId !== undefined) {
    conditions.push({ type_id: filters.officeTypeId });
  }

  if (filters.clientServiceTypeId !== undefined) {
    conditions.push({ client_service_type_id: filters.clientServiceTypeId });
  }

  const address = getTextFilterValue(filters.address);
  if (address) {
    conditions.push({ address: { contains: address, mode: "insensitive" } });
  }

  const city = getTextFilterValue(filters.city);
  if (city) {
    conditions.push({ city: { contains: city, mode: "insensitive" } });
  }

  const postalCode = getTextFilterValue(filters.postalCode);
  if (postalCode) {
    conditions.push({
      postal_code: { equals: postalCode, mode: "insensitive" },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
