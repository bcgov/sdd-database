import {
    Accordion,
    Button,
    Callout, Select,
    TextField,
} from "@bcgov/design-system-react-components";

import {PressEvent} from "@react-types/shared";
import {LookupOption} from "@/types";
import {
    AssignmentActionRow,
    AssignmentSectionContent
} from "@/components/EntityForms/Shared/AssignmentSectionLayout";


interface WorkspaceDetailsProps {
    isOnLeave: boolean
    workspaceAssignmentTypes: LookupOption[]
    selectedWorkspaceAssignmentTypeId: number | null
    setSelectedWorkspaceAssignmentTypeId: (id: number | null) => void

    workspaceNumber: string
    hasProgramAreaAssignment: boolean
    hasOfficeAssignment: boolean
    hasWorkspaceAssignment: boolean
    handleAssignWorkspace: (e: PressEvent) => Promise<void>
    handleRemoveWorkspace: () => void
}

export function WorkspaceDetails({
                                     isOnLeave,
                                     workspaceAssignmentTypes,
                                     selectedWorkspaceAssignmentTypeId,
                                     setSelectedWorkspaceAssignmentTypeId,

                                     workspaceNumber,
                                     hasProgramAreaAssignment,
                                     hasOfficeAssignment,
                                     hasWorkspaceAssignment,
                                     handleAssignWorkspace,
                                     handleRemoveWorkspace,
                                 }: WorkspaceDetailsProps) {

    const selectedWorkspaceAssignmentType = workspaceAssignmentTypes.find(
        assignmentType => assignmentType.id === selectedWorkspaceAssignmentTypeId
    )

    const isResidentAssignmentType = selectedWorkspaceAssignmentType?.name === "Resident"

    const workspaceAssignmentBlockedReason = !hasOfficeAssignment && !hasProgramAreaAssignment
        ? "Select a Program Area and assign an Office first to enable Workspace assignment"
        : !hasProgramAreaAssignment
            ? "Select a Program Area first to enable Workspace assignment"
            : !hasOfficeAssignment
                ? "Assign an Office first to enable Workspace assignment"
                : null

    return (
        <Accordion label="Workspace Details" id="workspaceDetails">
            <AssignmentSectionContent>
                <Select label="Assignment Type"
                        name="workspaceAssignmentType"
                        isRequired={!isOnLeave}
                        items={workspaceAssignmentTypes.map(workspaceAssignmentType => (
                            {
                                id: workspaceAssignmentType.id,
                                label: workspaceAssignmentType.name,
                            }
                        ))}
                        selectedKey={selectedWorkspaceAssignmentTypeId}
                        onSelectionChange={
                            (key) =>
                                setSelectedWorkspaceAssignmentTypeId(key == null ? null : Number(key))
                        }
                        placeholder="Select an Assignment Type"
                >
                </Select>

                {isResidentAssignmentType && (
                    <>
                        {
                            workspaceAssignmentBlockedReason &&
                            <Callout
                                description={workspaceAssignmentBlockedReason}>
                            </Callout>
                        }

                        <TextField label="Workspace Number"
                                   name="workspaceNumber"
                                   isRequired
                                   isReadOnly
                                   value={workspaceNumber}
                        >
                        </TextField>

                        <AssignmentActionRow>
                            <Button type="button"
                                    variant="secondary"
                                    isDisabled={!hasOfficeAssignment || !hasProgramAreaAssignment}
                                    onPress={handleAssignWorkspace}
                            >
                                {hasWorkspaceAssignment ? "Update" : "Assign"} Workspace
                            </Button>

                            {hasWorkspaceAssignment && (
                                <Button type="button"
                                        variant="secondary"
                                        danger
                                        onPress={handleRemoveWorkspace}
                                >
                                    Remove Workspace
                                </Button>
                            )}
                        </AssignmentActionRow>
                    </>
                )}
            </AssignmentSectionContent>
        </Accordion>
    )
}
