import { prisma } from "@/db/client";
import { Office, Prisma } from "@/generated/prisma/client";
import type { OfficeAdvancedSearchRequest } from "@/types";
import {
  buildOfficeAdvancedSearchFilter,
  buildOfficeKeywordSearchFilter,
} from "@/db/data-access/officeSearchFilters";
import { hasAdvancedSearchCriteria } from "@/domain/advancedSearch";

function findOfficesBySearchFilter(searchFilter: Prisma.OfficeWhereInput) {
  return prisma.office.findMany({
    where: searchFilter,
  });
}

export async function getOfficesByFilter(query?: string): Promise<Office[]> {
  return findOfficesBySearchFilter(
    query ? buildOfficeKeywordSearchFilter(query) : {},
  );
}

export async function getOfficesByAdvancedFilter(
  request: OfficeAdvancedSearchRequest,
): Promise<Office[]> {
  if (!hasAdvancedSearchCriteria(request.query, request.filters)) {
    return [];
  }

  return findOfficesBySearchFilter(buildOfficeAdvancedSearchFilter(request));
}

export async function officeExistsByOfficeNumber(officeNumber: string) {
  const office = await prisma.office.findUnique({
    where: {
      office_number: officeNumber,
    },
    select: {
      office_number: true,
    },
  });

  return office !== null;
}
