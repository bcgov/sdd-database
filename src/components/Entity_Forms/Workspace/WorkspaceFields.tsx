import {
    Accordion,
    AccordionGroup,
    Button,
    Select,
    TextArea,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@bcgov/design-system-react-components";

import {WorkspaceSearchResult} from "@/types";


interface WorkspaceFieldsProps {
    workspace: WorkspaceSearchResult;
    onHold: () => void;
    onRemoveHold: () => void;
}

export function WorkspaceFields({
                                    workspace,
                                    onHold,
                                    onRemoveHold,
                                }: WorkspaceFieldsProps) {
    const hasAssignedEmployee = !!workspace.assigned_employee

    const workspaceStatus = hasAssignedEmployee
        ? "occupied"
        : workspace.is_on_hold
            ? "onHold"
            : "available"

    const canHold = workspaceStatus === "available";
    const canRemoveHold = workspaceStatus === "onHold"

    const hasNotes = !!workspace.notes

    return (
        <AccordionGroup allowsMultipleExpanded
                        defaultExpandedKeys={["workspaceDetails", "assignedEmployeeDetails"]}
                        style={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                        }}>

            <Accordion label="Workspace Details" id="workspaceDetails">
                <div>
                    <TextField label="Workspace Number"
                               name="number"
                               isReadOnly
                               defaultValue={workspace.workspace_number}
                    >
                    </TextField>

                    <TextField label="Office Number"
                               name="officeNumber"
                               isReadOnly
                               defaultValue={workspace.office_number}>
                    </TextField>

                    <Select label="Category"
                            items={[
                                {
                                    id: workspace.category.id,
                                    label: workspace.category.name,
                                }
                            ]}
                            isDisabled
                            defaultValue={workspace.category_id}>
                    </Select>

                    <div style={{width: "fit-content", marginBottom: "0.5rem"}}>

                        <ToggleButtonGroup label="Status"
                                           isDisabled
                                           disallowEmptySelection
                                           selectedKeys={[workspaceStatus]}
                                           style={{width: "fit-content"}}
                        >
                            <ToggleButton id="available">Available</ToggleButton>
                            <ToggleButton id="onHold">On Hold</ToggleButton>
                            <ToggleButton id="occupied">Occupied</ToggleButton>
                        </ToggleButtonGroup>

                            {canHold &&
                                <Button onPress={onHold}
                                        style={{marginTop: "0.5rem"}}
                                >
                                    Hold Workspace
                                </Button>
                            }

                            {canRemoveHold &&
                                <Button onPress={onRemoveHold}
                                        style={{marginTop: "0.5rem"}}
                                >
                                    Remove Hold
                                </Button>}
                    </div>

                    {hasNotes &&
                        <TextArea label="Notes"
                                  name="notes"
                                  isReadOnly
                                  maxLength={2000}
                                  defaultValue={workspace.notes ?? undefined}>
                        </TextArea>}
                </div>
            </Accordion>

            {hasAssignedEmployee && (
                <Accordion label="Assigned Employee Details" id="assignedEmployeeDetails">
                    <div>
                        <TextField label="First Name"
                                   name="firstName"
                                   isReadOnly
                                   defaultValue={workspace.assigned_employee?.first_name}
                        >
                        </TextField>

                        <TextField label="Last Name"
                                   name="lastName"
                                   isReadOnly
                                   defaultValue={workspace.assigned_employee?.last_name}
                        >
                        </TextField>

                        <TextField label="Alternate Name"
                                   name="alternateName"
                                   isReadOnly
                                   defaultValue={workspace.assigned_employee?.alternate_name ?? ""}
                        >
                        </TextField>

                        <TextField label="IDIR"
                                   name="idir"
                                   isReadOnly
                                   defaultValue={workspace.assigned_employee?.idir ?? ""}
                        >
                        </TextField>
                    </div>
                </Accordion>)}
        </AccordionGroup>
    )
}
