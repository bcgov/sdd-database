import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/db/client";
import {
  WorkspaceAdvancedSearchRequest,
  WorkspaceFormValues,
  WorkspaceSearchResult,
} from "@/types";
import { workspaceSearchResultArgs } from "@/db/data-access/searchResultArgs";
import {
  buildAssignableWorkspaceKeywordSearchFilter,
  buildWorkspaceAdvancedSearchFilter,
  buildWorkspaceKeywordSearchFilter,
} from "@/db/data-access/workspaceSearchFilters";
import { hasAdvancedSearchCriteria } from "@/domain/advancedSearch";

export async function getWorkspaceByOfficeAndWorkspaceNumber(
  officeNumber: string,
  workspaceNumber: string,
) {
  return prisma.workspace.findUnique({
    where: {
      office_number_workspace_number: {
        office_number: officeNumber,
        workspace_number: workspaceNumber,
      },
    },
  });
}

export async function getWorkspacesByFilter(
  query?: string,
): Promise<WorkspaceSearchResult[]> {
  const searchFilter: Prisma.WorkspaceWhereInput = query
    ? buildWorkspaceKeywordSearchFilter(query)
    : {};

  return prisma.workspace.findMany({
    where: searchFilter,
    ...workspaceSearchResultArgs,
  });
}

export async function getWorkspacesByAdvancedFilter(
  request: WorkspaceAdvancedSearchRequest,
): Promise<WorkspaceSearchResult[]> {
  if (!hasAdvancedSearchCriteria(request.query, request.filters)) {
    return [];
  }

  return prisma.workspace.findMany({
    where: buildWorkspaceAdvancedSearchFilter(request),
    ...workspaceSearchResultArgs,
  });
}

export async function getWorkspacesByOfficeCode(
  officeCode: string,
): Promise<WorkspaceSearchResult[]> {
  return prisma.workspace.findMany({
    where: {
      office_number: officeCode,
    },
    orderBy: {
      workspace_number: "asc",
    },
    ...workspaceSearchResultArgs,
  });
}

export async function getAssignableWorkspacesByFilter(
  employeeOfficeNumber: string,
  employeeProgramAreaId: number,
  query?: string,
): Promise<WorkspaceSearchResult[]> {
  const assignmentFilters: Prisma.WorkspaceWhereInput[] = [
    {
      OR: [
        { restricted_program_area_id: null },
        { restricted_program_area_id: employeeProgramAreaId },
      ],
    },
  ];

  if (query) {
    assignmentFilters.push(
      buildAssignableWorkspaceKeywordSearchFilter(query),
    );
  }

  return prisma.workspace.findMany({
    where: {
      office_number: employeeOfficeNumber,
      employee_id: null,
      is_on_hold: true,
      AND: assignmentFilters,
    },
    /**
     * assigned_employee should be null
     * Other included relations like category, desk_type and restrictions are still needed for display and to
     * align with the WorkspaceSearchResult / Entity shape
     */
    ...workspaceSearchResultArgs,
    orderBy: {
      workspace_number: "asc",
    },
  });
}

export async function updateWorkspace(workspaceForm: WorkspaceFormValues) {
  const existingWorkspace = await getWorkspaceByOfficeAndWorkspaceNumber(
    workspaceForm.office_number,
    workspaceForm.workspace_number,
  );

  if (!existingWorkspace) {
    throw new Error("Workspace not found");
  }

  if (
    existingWorkspace.employee_id !== null &&
    workspaceForm.is_on_hold !== existingWorkspace.is_on_hold
  ) {
    throw new Error(
      "Occupied workspaces cannot have their hold status changed",
    );
  }

  return prisma.workspace.update({
    where: {
      office_number_workspace_number: {
        office_number: workspaceForm.office_number,
        workspace_number: workspaceForm.workspace_number,
      },
    },
    data: {
      notes: workspaceForm.notes ?? existingWorkspace.notes,
      position_number: workspaceForm.position_number,
      is_on_hold: workspaceForm.is_on_hold,
    },
  });
}
