import { WorkspaceSearchResult } from "@/types";
import { AccordionGroup } from "@bcgov/design-system-react-components";
import { WorkspaceDetails } from "@/components/EntityForms/Workspace/WorkspaceDetails";
import { WorkspaceProtections } from "@/components/EntityForms/Workspace/WorkspaceProtections";
import { AssignedEmployeeDetails } from "@/components/EntityForms/Shared/AssignedEmployeeDetails";
import {
  canHoldWorkspace,
  canRemoveWorkspaceHold,
  getWorkspaceStatus,
} from "@/domain/workspaces";

interface WorkspaceFormProps {
  workspace: WorkspaceSearchResult;
  onHold: () => void;
  onRemoveHold: () => void;
}

export function WorkspaceForm({
  workspace,
  onHold,
  onRemoveHold,
}: WorkspaceFormProps) {
  const workspaceStatus = getWorkspaceStatus(workspace);

  const restrictedProgramArea = workspace.restricted_program_area;
  const restrictedBranch = restrictedProgramArea?.branch;

  return (
    <div
      style={{
        paddingRight: "0.5rem",
      }}
    >
      <AccordionGroup
        allowsMultipleExpanded
        defaultExpandedKeys={["workspaceDetails", "assignedEmployeeDetails"]}
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <WorkspaceDetails
          workspace={workspace}
          workspaceStatus={workspaceStatus}
          canHold={canHoldWorkspace(workspaceStatus)}
          canRemoveHold={canRemoveWorkspaceHold(workspaceStatus)}
          onHold={onHold}
          onRemoveHold={onRemoveHold}
        ></WorkspaceDetails>

        {restrictedProgramArea && restrictedBranch && (
          <WorkspaceProtections
            branchId={restrictedBranch.id}
            branchName={restrictedBranch.name}
            programAreaId={restrictedProgramArea.id}
            programAreaName={restrictedProgramArea.name}
          ></WorkspaceProtections>
        )}

        {workspace.assigned_employee && (
          <AssignedEmployeeDetails
            assignedEmployee={workspace.assigned_employee}
          />
        )}
      </AccordionGroup>
    </div>
  );
}
