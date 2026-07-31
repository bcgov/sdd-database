import {
  Accordion,
  Button,
  Select,
  TextArea,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@bcgov/design-system-react-components";
import { WorkspaceSearchResult } from "@/types";
import { WorkspaceStatus } from "@/domain/workspaces";
import {
  validateNotesField,
  validateWorkspacePositionNumberField,
} from "@/validators";

interface WorkspaceDetailsProps {
  workspace: WorkspaceSearchResult;
  workspaceStatus: WorkspaceStatus;
  canHold: boolean;
  canRemoveHold: boolean;
  onStageHold: () => void;
  onStageRemoveHold: () => void;
}

function formatOfficeFloor(officeFloor: number) {
  const mod10 = officeFloor % 10;
  const mod100 = officeFloor % 100;

  if (mod10 === 1 && mod100 !== 11) return `${officeFloor}st Floor`;
  if (mod10 === 2 && mod100 !== 12) return `${officeFloor}nd Floor`;
  if (mod10 === 3 && mod100 !== 13) return `${officeFloor}rd Floor`;

  return `${officeFloor}th Floor`;
}

export function WorkspaceDetails({
  workspace,
  workspaceStatus,
  canHold,
  canRemoveHold,
  onStageHold,
  onStageRemoveHold,
}: WorkspaceDetailsProps) {
  const hasNotes = !!workspace.notes;

  return (
    <Accordion label="Workspace Details" id="workspaceDetails">
      <div>
        <TextField
          label="Workspace Number"
          isReadOnly
          defaultValue={workspace.workspace_number}
        ></TextField>

        <TextField
          label="Office Number"
          isReadOnly
          defaultValue={workspace.office_number}
        ></TextField>

        <TextField
          label="Office Floor"
          isReadOnly
          defaultValue={formatOfficeFloor(workspace.office_floor)}
        ></TextField>

        <Select
          label="Category"
          items={[
            {
              id: workspace.category.id,
              label: workspace.category.name,
            },
          ]}
          isDisabled
          defaultValue={workspace.category_id}
        ></Select>

        <Select
          label="Desk Type"
          items={[
            {
              id: workspace.desk_type_id,
              label: workspace.desk_type.name,
            },
          ]}
          isDisabled
          defaultValue={workspace.desk_type_id}
        ></Select>

        <div style={{ width: "fit-content", marginBottom: "0.5rem" }}>
          <ToggleButtonGroup
            label="Status"
            aria-label="Status"
            isDisabled
            disallowEmptySelection
            selectedKeys={[workspaceStatus]}
            style={{ width: "fit-content" }}
          >
            <ToggleButton id="available">Available</ToggleButton>
            <ToggleButton id="onHold">On Hold</ToggleButton>
            <ToggleButton id="occupied">Occupied</ToggleButton>
          </ToggleButtonGroup>

          {canHold && (
            <Button
              type="button"
              onPress={onStageHold}
              style={{ marginTop: "0.5rem" }}
            >
              Hold Workspace
            </Button>
          )}

          {canRemoveHold && (
            <Button
              type="button"
              onPress={onStageRemoveHold}
              style={{ marginTop: "0.5rem" }}
            >
              Remove Hold
            </Button>
          )}
        </div>

        <TextField
          label="Position No"
          name="positionNumber"
          inputMode="numeric"
          maxLength={8}
          validate={validateWorkspacePositionNumberField}
          defaultValue={workspace.position_number ?? undefined}
        ></TextField>

        <TextArea
          label="Notes"
          name="notes"
          maxLength={200}
          validate={validateNotesField}
          defaultValue={workspace.notes ?? undefined}
        ></TextArea>
      </div>
    </Accordion>
  );
}
