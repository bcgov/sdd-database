import type { Prisma } from "@/generated/prisma/client";
import type { WorkstationAdvancedSearchRequest } from "@/types";
import { buildAssignedEmployeeSearchFilter } from "@/db/data-access/searchFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildWorkstationKeywordSearchFilter(
  query: string,
): Prisma.WorkstationWhereInput {
  return {
    OR: [
      { asset_tag: { contains: query, mode: "insensitive" } },
      {
        workstation_model: {
          name: { contains: query, mode: "insensitive" },
        },
      },
      { office_number: { contains: query } },
      { notes: { contains: query, mode: "insensitive" } },
      buildAssignedEmployeeSearchFilter(query),
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
    conditions.push({ notes: { equals: notes, mode: "insensitive" } });
  }

  if (filters.isAssigned !== undefined) {
    conditions.push({
      employee_id: filters.isAssigned ? { not: null } : null,
    });
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
