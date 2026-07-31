import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/db/client";
import { WorkspaceFormValues, WorkspaceSearchResult } from "@/types";
import { workspaceSearchResultArgs } from "@/db/data-access/searchResultArgs";
import { buildAssignedEmployeeSearchFilter } from "@/db/data-access/searchFilters";

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
    ? {
        OR: [
          { office_number: { contains: query, mode: "insensitive" } },
          { workspace_number: { contains: query, mode: "insensitive" } },
          { position_number: { contains: query } },
          { category: { name: { contains: query, mode: "insensitive" } } },
          { desk_type: { name: { contains: query, mode: "insensitive" } } },
          buildAssignedEmployeeSearchFilter(query),
        ],
      }
    : {};

  return prisma.workspace.findMany({
    where: searchFilter,
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
    assignmentFilters.push({
      OR: [
        { workspace_number: { contains: query, mode: "insensitive" } },
        { position_number: { contains: query } },
        { category: { name: { contains: query, mode: "insensitive" } } },
        { desk_type: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
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
