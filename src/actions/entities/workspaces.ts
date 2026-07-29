"use server";

import {
    getAssignableWorkspacesByFilter,
    getWorkspacesByFilter,
    getWorkspacesByOfficeCode,
    hold,
    updateWorkspace,
    removeHold
} from "@/db/data-access/workspaces";
import {EntityActionResult, WorkspaceEntity} from "@/types";
import {attachEntityType} from "@/actions/attachEntityType";

export async function searchWorkspacesAction(query?: string): Promise<WorkspaceEntity[]>  {
    const workspaceSearchResults = await getWorkspacesByFilter(query)

    // Attaching discriminant 'type'
    return attachEntityType(workspaceSearchResults, "workspace")
}

export async function searchWorkspacesByOfficeCodeAction(
    officeCode: string
): Promise<WorkspaceEntity[]> {
    const workspaceSearchResults = await getWorkspacesByOfficeCode(officeCode)
    return attachEntityType(workspaceSearchResults, "workspace")
}

export async function searchAssignableWorkspacesAction(
    employeeOfficeNumber: string,
    employeeProgramAreaId: number,
    query?: string
): Promise<WorkspaceEntity[]> {
    const workspaceSearchResults = await getAssignableWorkspacesByFilter(
        employeeOfficeNumber,
        employeeProgramAreaId,
        query
    )

    // Attaching discriminant 'type'
    return attachEntityType(workspaceSearchResults, "workspace")
}

export async function holdAction(
    officeNumber: string,
    workspaceNumber: string,
): Promise<EntityActionResult> {
    try {
        await hold(officeNumber, workspaceNumber)

        return {status: "ok" }
    }
    catch (error) {
        return {
            status: "error",
            error: error instanceof Error
                ? error.message
                : "Could not hold workspace"
        }
    }
}

export async function removeHoldAction(
    officeNumber: string,
    workspaceNumber: string,
): Promise<EntityActionResult> {
    try {
    await removeHold(officeNumber, workspaceNumber)
        return {status: "ok" }
    }
    catch (error) {
        return {
            status: "error",
            error: error instanceof Error
                ? error.message
                : "Could not remove workspace hold"
        }
    }
}

export async function updateWorkspaceAction(
    _prevState: EntityActionResult,
    formData: FormData
): Promise<EntityActionResult> {
    const officeNumber = formData.get("officeNumber")?.toString();
    const workspaceNumber = formData.get("workspaceNumber")?.toString();
    const notes = formData.get("notes")?.toString();

    if (!officeNumber || !workspaceNumber) {
        return {
            status: "error",
            error: "Missing workspace identifiers"
        }
    }

    try {
        await updateWorkspace(officeNumber, workspaceNumber, notes)

        return {status: "ok" }
    }
    catch (error) {
        return {
            status: "error",
            error: error instanceof Error
                ? error.message
                : "Could not update workspace"
        }
    }
}
