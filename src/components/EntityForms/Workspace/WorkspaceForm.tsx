import {WorkspaceSearchResult} from "@/types";
import {AccordionGroup} from "@bcgov/design-system-react-components";
import {WorkspaceDetails} from "@/components/EntityForms/Workspace/WorkspaceDetails";
import {WorkspaceProtections} from "@/components/EntityForms/Workspace/WorkspaceProtections";
import {AssignedEmployeeDetails} from "@/components/EntityForms/Shared/AssignedEmployeeDetails";


interface WorkspaceFormProps {
    workspace: WorkspaceSearchResult;
    onHold: () => void
    onRemoveHold: () => void
}

export function WorkspaceForm({
                                  workspace,
                                  onHold,
                                  onRemoveHold,
                              }: WorkspaceFormProps) {

    const hasAssignedEmployee = !!workspace.assigned_employee

    const workspaceStatus = hasAssignedEmployee
        ? "occupied"
        : workspace.is_on_hold
            ? "onHold"
            : "available"

    const canHold = workspaceStatus === "available"
    const canRemoveHold = workspaceStatus === "onHold"

    const restrictedProgramArea = workspace.restricted_program_area
    const restrictedBranch = restrictedProgramArea?.branch

    return (
        <div style={{
            maxHeight: "88vh",
            overflowY: "auto",
            paddingRight: "0.5rem",
        }}
        >
            <AccordionGroup allowsMultipleExpanded
                            defaultExpandedKeys={["workspaceDetails", "assignedEmployeeDetails"]}
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem",
                            }}>
                <WorkspaceDetails workspace={workspace}
                                  workspaceStatus={workspaceStatus}
                                  canHold={canHold}
                                  canRemoveHold={canRemoveHold}
                                  onHold={onHold}
                                  onRemoveHold={onRemoveHold}>
                </WorkspaceDetails>

                {restrictedProgramArea && restrictedBranch && (
                    <WorkspaceProtections branchId={restrictedBranch.id}
                                          branchName={restrictedBranch.name}
                                          programAreaId={restrictedProgramArea.id}
                                          programAreaName={restrictedProgramArea.name}>
                    </WorkspaceProtections>

                )}

                {workspace.assigned_employee &&
                    (<AssignedEmployeeDetails assignedEmployee={workspace.assigned_employee}/>)}
            </AccordionGroup>
        </div>
    )
}
