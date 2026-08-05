import type { Prisma } from "@/generated/prisma/client";
import type { OfficeAdvancedSearchRequest } from "@/types";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildOfficeKeywordSearchFilter(
  query: string,
): Prisma.OfficeWhereInput {
  return {
    OR: [
      { office_number: { contains: query, mode: "insensitive" } },
      { office_name: { contains: query, mode: "insensitive" } },
      {
        office_type: {
          name: { contains: query, mode: "insensitive" },
        },
      },
      {
        client_service_type: {
          name: { contains: query, mode: "insensitive" },
        },
      },
      { address: { contains: query, mode: "insensitive" } },
      { city: { contains: query, mode: "insensitive" } },
      { postal_code: { contains: query, mode: "insensitive" } },
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
      office_name: { equals: officeName, mode: "insensitive" },
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
    conditions.push({ address: { equals: address, mode: "insensitive" } });
  }

  const city = getTextFilterValue(filters.city);
  if (city) {
    conditions.push({ city: { equals: city, mode: "insensitive" } });
  }

  const postalCode = getTextFilterValue(filters.postalCode);
  if (postalCode) {
    conditions.push({
      postal_code: { equals: postalCode, mode: "insensitive" },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
