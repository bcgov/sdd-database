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
    hasOfficeAssignment: boolean
    hasWorkspaceAssignment: boolean
    handleAssignWorkspace: (e: PressEvent) => Promise<void>
    handleRemoveWorkspace: () => void
}

export function WorkspaceSection({
                                     workspaceNumber,
                                     hasOfficeAssignment,
                                     hasWorkspaceAssignment,
                                     handleAssignWorkspace,
                                     handleRemoveWorkspace,
                                 }: WorkspaceSectionProps) {
    return (
        <Accordion label="Workspace Details" id="workspaceDetails">
            <div>
                {!hasOfficeAssignment &&
                    <div style={{
                        marginBottom: "1rem",
                    }}>
                        <Callout
                            description={`Assign an office first to enable workspace assignment`}>
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
                        isDisabled={!hasOfficeAssignment}
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
