import type { Prisma } from "@/generated/prisma/client";
import type { WorkstationAdvancedSearchRequest } from "@/types";
import {
  buildAssignedEmployeeSearchFilter,
  parseKeywordSearchQuery,
} from "@/db/data-access/searchFilters";
import { buildWorkstationRedeployFilter } from "@/db/data-access/redeployFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildWorkstationKeywordSearchFilter(
  query: string,
): Prisma.WorkstationWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;
  const descriptiveFilters: Prisma.WorkstationWhereInput[] = isDigitsOnly
    ? []
    : [
        {
          workstation_model: {
            name: { contains: value, mode: "insensitive" },
          },
        },
        { notes: { contains: value, mode: "insensitive" } },
      ];

  return {
    OR: [
      { asset_tag: { equals: value, mode: "insensitive" } },
      { office_number: { equals: value, mode: "insensitive" } },
      buildAssignedEmployeeSearchFilter(searchQuery),
      ...descriptiveFilters,
    ],
  };
}

export function buildAssignableWorkstationKeywordSearchFilter(
  query: string,
): Prisma.WorkstationWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;

  return {
    OR: [
      { asset_tag: { equals: value, mode: "insensitive" } },
      { office_number: { equals: value, mode: "insensitive" } },
      ...(!isDigitsOnly
        ? [
            {
              workstation_model: {
                name: { contains: value, mode: "insensitive" as const },
              },
            },
          ]
        : []),
    ],
  };
}

export function buildWorkstationAdvancedSearchFilter(
  request: WorkstationAdvancedSearchRequest,
): Prisma.WorkstationWhereInput {
  const conditions: Prisma.WorkstationWhereInput[] = [];
  const { filters } = request;
  const query = getTextFilterValue(request.query);

  if (query) {
    conditions.push(buildWorkstationKeywordSearchFilter(query));
  }

  const assetTag = getTextFilterValue(filters.assetTag);
  if (assetTag) {
    conditions.push({
      asset_tag: { equals: assetTag, mode: "insensitive" },
    });
  }

  if (filters.modelId !== undefined) {
    conditions.push({ model_id: filters.modelId });
  }

  const officeNumber = getTextFilterValue(filters.officeNumber);
  if (officeNumber) {
    conditions.push({
      office_number: { equals: officeNumber, mode: "insensitive" },
    });
  }

  const notes = getTextFilterValue(filters.notes);
  if (notes) {
    conditions.push({ notes: { contains: notes, mode: "insensitive" } });
  }

  if (filters.isAssigned !== undefined) {
    conditions.push(
      filters.isAssigned
        ? { employee_id: { not: null } }
        : buildWorkstationRedeployFilter(),
    );
  }

  const assignedEmployeeIdir = getTextFilterValue(filters.assignedEmployeeIdir);
  if (assignedEmployeeIdir) {
    conditions.push({
      assigned_employee: {
        is: {
          idir: { equals: assignedEmployeeIdir, mode: "insensitive" },
        },
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
