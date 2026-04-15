import {
    Accordion,
    Button,
    ButtonGroup,
    Callout,
    TextField,
} from "@bcgov/design-system-react-components";

import {PressEvent} from "@react-types/shared";

interface WorkspaceSectionProps {
    workspaceNumber: string
    hasProgramAreaAssignment: boolean
    hasOfficeAssignment: boolean
    hasWorkspaceAssignment: boolean
    handleAssignWorkspace: (e: PressEvent) => Promise<void>
    handleRemoveWorkspace: () => void
}

export function WorkspaceSection({
                                     workspaceNumber,
                                     hasProgramAreaAssignment,
                                     hasOfficeAssignment,
                                     hasWorkspaceAssignment,
                                     handleAssignWorkspace,
                                     handleRemoveWorkspace,
                                 }: WorkspaceSectionProps) {

    const workspaceAssignmentBlockedReason = !hasOfficeAssignment && !hasProgramAreaAssignment
        ? "Select a Program Area and assign an Office first to enable Workspace assignment"
        : !hasProgramAreaAssignment
            ? "Select a Program Area first to enable Workspace assignment"
            : !hasOfficeAssignment
                ? "Assign an Office first to enable Workspace assignment"
                : null

    return (
        <Accordion label="Workspace Details" id="workspaceDetails">
            <div>
                {workspaceAssignmentBlockedReason &&
                    <div style={{
                        marginBottom: "1rem",
                    }}>
                        <Callout
                            description={workspaceAssignmentBlockedReason}>
                        </Callout>
                    </div>
                }

                <TextField
                    label="Workspace Number"
                    name="workspaceNumber"
                    isReadOnly
                    value={workspaceNumber}
                >
                </TextField>

                <ButtonGroup>
                    <Button
                        variant="secondary"
                        isDisabled={!hasOfficeAssignment || !hasProgramAreaAssignment}
                        onPress={handleAssignWorkspace}
                    >
                        {hasWorkspaceAssignment ? "Update" : "Assign"} Workspace
                    </Button>

                    {hasWorkspaceAssignment && (
                        <Button
                            variant="secondary"
                            danger
                            onPress={handleRemoveWorkspace}
                        >
                            Remove Workspace
                        </Button>
                    )}
                </ButtonGroup>
            </div>
        </Accordion>
    )
}
