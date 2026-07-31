"use server";

import {
  getAssignableWorkspacesByFilter,
  getWorkspacesByFilter,
  getWorkspacesByOfficeCode,
  updateWorkspace,
} from "@/db/data-access/workspaces";
import { EntityActionResult, WorkspaceEntity } from "@/types";
import { attachEntityType } from "@/actions/attachEntityType";
import { parseWorkspaceFormData } from "@/utils";
import { validateWorkspacePositionNumberField } from "@/validators";

export async function searchWorkspacesAction(
  query?: string,
): Promise<WorkspaceEntity[]> {
  const workspaceSearchResults = await getWorkspacesByFilter(query);

  // Attaching discriminant 'type'
  return attachEntityType(workspaceSearchResults, "workspace");
}

export async function searchWorkspacesByOfficeCodeAction(
  officeCode: string,
): Promise<WorkspaceEntity[]> {
  const workspaceSearchResults = await getWorkspacesByOfficeCode(officeCode);
  return attachEntityType(workspaceSearchResults, "workspace");
}

export async function searchAssignableWorkspacesAction(
  employeeOfficeNumber: string,
  employeeProgramAreaId: number,
  query?: string,
): Promise<WorkspaceEntity[]> {
  const workspaceSearchResults = await getAssignableWorkspacesByFilter(
    employeeOfficeNumber,
    employeeProgramAreaId,
    query,
  );

  // Attaching discriminant 'type'
  return attachEntityType(workspaceSearchResults, "workspace");
}

export async function updateWorkspaceAction(
  _prevState: EntityActionResult,
  formData: FormData,
): Promise<EntityActionResult> {
  const rawIsOnHold = formData.get("isOnHold");
  const workspace = parseWorkspaceFormData(formData);

  if (!workspace.office_number || !workspace.workspace_number) {
    return {
      status: "error",
      error: "Missing workspace identifiers",
    };
  }

  if (rawIsOnHold !== "true" && rawIsOnHold !== "false") {
    return {
      status: "error",
      error: "Missing workspace hold status",
    };
  }

  const positionNumberValidationError = workspace.position_number
    ? validateWorkspacePositionNumberField(workspace.position_number)
    : undefined;

  if (positionNumberValidationError) {
    return {
      status: "error",
      error: positionNumberValidationError,
    };
  }

  try {
    await updateWorkspace(workspace);

    return { status: "ok" };
  } catch (error) {
    return {
      status: "error",
      error:
        error instanceof Error ? error.message : "Could not update workspace",
    };
  }
}
