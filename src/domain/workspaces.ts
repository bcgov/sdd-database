export type WorkspaceStatus = "available" | "onHold" | "occupied"

export function getWorkspaceStatus(workspace: {
    employee_id: number | null
    is_on_hold: boolean
}): WorkspaceStatus {

    if (workspace.employee_id !== null) return "occupied"
    if (workspace.is_on_hold) return "onHold"

    return "available"
}

export function canHoldWorkspace(workspaceStatus: WorkspaceStatus) {
    return workspaceStatus === "available"
}

export function canRemoveWorkspaceHold(workspaceStatus: WorkspaceStatus) {
    return workspaceStatus === "onHold"
}
