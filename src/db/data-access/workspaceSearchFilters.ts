import type { Prisma } from "@/generated/prisma/client";
import type { WorkspaceAdvancedSearchRequest } from "@/types";
import { buildAssignedEmployeeSearchFilter } from "@/db/data-access/searchFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildWorkspaceKeywordSearchFilter(
  query: string,
): Prisma.WorkspaceWhereInput {
  return {
    OR: [
      { office_number: { contains: query, mode: "insensitive" } },
      { workspace_number: { contains: query, mode: "insensitive" } },
      { position_number: { contains: query } },
      { category: { name: { contains: query, mode: "insensitive" } } },
      { desk_type: { name: { contains: query, mode: "insensitive" } } },
      buildAssignedEmployeeSearchFilter(query),
    ],
  };
}

export function buildWorkspaceAdvancedSearchFilter(
  request: WorkspaceAdvancedSearchRequest,
): Prisma.WorkspaceWhereInput {
  const conditions: Prisma.WorkspaceWhereInput[] = [];
  const { filters } = request;
  const query = getTextFilterValue(request.query);

  if (query) {
    conditions.push(buildWorkspaceKeywordSearchFilter(query));
  }

  const officeNumber = getTextFilterValue(filters.officeNumber);
  if (officeNumber) {
    conditions.push({
      office_number: { equals: officeNumber, mode: "insensitive" },
    });
  }

  const workspaceNumber = getTextFilterValue(filters.workspaceNumber);
  if (workspaceNumber) {
    conditions.push({
      workspace_number: { equals: workspaceNumber, mode: "insensitive" },
    });
  }

  const positionNumber = getTextFilterValue(filters.positionNumber);
  if (positionNumber) {
    conditions.push({ position_number: { equals: positionNumber } });
  }

  if (filters.categoryId !== undefined) {
    conditions.push({ category_id: filters.categoryId });
  }

  if (filters.deskTypeId !== undefined) {
    conditions.push({ desk_type_id: filters.deskTypeId });
  }

  if (filters.officeFloor !== undefined) {
    conditions.push({ office_floor: filters.officeFloor });
  }

  const notes = getTextFilterValue(filters.notes);
  if (notes) {
    conditions.push({ notes: { equals: notes, mode: "insensitive" } });
  }

  switch (filters.status) {
    case "available":
      conditions.push({ employee_id: null, is_on_hold: false });
      break;
    case "onHold":
      conditions.push({ employee_id: null, is_on_hold: true });
      break;
    case "occupied":
      conditions.push({ employee_id: { not: null } });
      break;
  }

  if (filters.restrictedBranchId !== undefined) {
    conditions.push({
      restricted_program_area: {
        is: { branch_id: filters.restrictedBranchId },
      },
    });
  }

  if (filters.restrictedProgramAreaId !== undefined) {
    conditions.push({
      restricted_program_area_id: filters.restrictedProgramAreaId,
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
