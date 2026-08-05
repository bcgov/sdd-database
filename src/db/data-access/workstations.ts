import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/db/client";
import {
  WorkstationAdvancedSearchRequest,
  WorkstationFormValues,
  WorkstationSearchResult,
} from "@/types";
import { workstationSearchResultArgs } from "@/db/data-access/searchResultArgs";
import {
  buildWorkstationAdvancedSearchFilter,
  buildWorkstationKeywordSearchFilter,
} from "@/db/data-access/workstationSearchFilters";
import { hasAdvancedSearchCriteria } from "@/domain/advancedSearch";

export async function getWorkstationsByAssetTags(assetTags: string[]) {
  if (assetTags.length === 0) return [];

  return prisma.workstation.findMany({
    where: {
      asset_tag: {
        in: assetTags,
      },
    },
  });
}

const workstationsOrderBy: Prisma.WorkstationOrderByWithRelationInput[] = [
  {
    workstation_model: {
      name: "desc",
    },
  },
  {
    asset_tag: "asc",
  },
];

export async function getWorkstationsByFilter(
  query?: string,
): Promise<WorkstationSearchResult[]> {
  const searchFilter: Prisma.WorkstationWhereInput = query
    ? buildWorkstationKeywordSearchFilter(query)
    : {};

  return prisma.workstation.findMany({
    where: searchFilter,
    ...workstationSearchResultArgs,
    orderBy: workstationsOrderBy,
  });
}

export async function getWorkstationsByAdvancedFilter(
  request: WorkstationAdvancedSearchRequest,
): Promise<WorkstationSearchResult[]> {
  if (!hasAdvancedSearchCriteria(request.query, request.filters)) {
    return [];
  }

  return prisma.workstation.findMany({
    where: buildWorkstationAdvancedSearchFilter(request),
    ...workstationSearchResultArgs,
    orderBy: workstationsOrderBy,
  });
}

export async function getAssignableWorkstationsByFilter(
  query?: string,
): Promise<WorkstationSearchResult[]> {
  const searchFilter: Prisma.WorkstationWhereInput = query
    ? {
        OR: [
          { asset_tag: { contains: query, mode: "insensitive" } },
          {
            workstation_model: {
              name: { contains: query, mode: "insensitive" },
            },
          },
          { office_number: { contains: query } },
        ],
      }
    : {};

  return prisma.workstation.findMany({
    where: {
      employee_id: null,
      ...searchFilter,
    },
    ...workstationSearchResultArgs,
    orderBy: workstationsOrderBy,
  });
}

export async function addNewWorkstation(workstation: WorkstationFormValues) {
  return prisma.workstation.create({
    data: workstation,
  });
}

export async function updateWorkstation(workstation: WorkstationFormValues) {
  // defensive check in case parseWorkstationData gets empty string for asset tag
  if (!workstation.asset_tag) {
    throw new Error(
      `Didn't find the workstation asset tag. Can't update workstation`,
    );
  }

  const existingWorkstation = await prisma.workstation.findUnique({
    where: {
      asset_tag: workstation.asset_tag,
    },
    select: {
      employee_id: true,
    },
  });

  if (!existingWorkstation) {
    throw new Error(
      `Workstation with asset tag ${workstation.asset_tag} not found`,
    );
  }

  return prisma.workstation.update({
    where: {
      asset_tag: workstation.asset_tag,
    },
    data: {
      notes: workstation.notes,

      // Office number is manually editable only while the workstation is unassigned
      ...(existingWorkstation.employee_id === null
        ? { office_number: workstation.office_number }
        : {}),
    },
  });
}

export async function deleteWorkstation(assetTag: string) {
  const { count } = await prisma.workstation.deleteMany({
    where: {
      asset_tag: assetTag,
      employee_id: null,
    },
  });

  if (count === 0) {
    throw new Error(
      `Workstation ${assetTag} was not found or has an assigned employee`,
    );
  }
}
