import {Accordion, Button, TextField} from "@bcgov/design-system-react-components";
import {PressEvent} from "@react-types/shared";
import {
    AssignmentActionRow,
    AssignmentItem,
    AssignmentSectionContent
} from "@/components/EntityForms/Employee/AssignmentSectionLayout";


interface WorkstationDetailsProps {
    workstationAssetTags: string[]
    handleAssignWorkstation: (e: PressEvent) => Promise<void>
    handleRemoveWorkstation: (assetTag: string) => void
}

export function WorkstationDetails({
                                       workstationAssetTags,
                                       handleAssignWorkstation,
                                       handleRemoveWorkstation,
                                   }: WorkstationDetailsProps) {

    const hasWorkstations = workstationAssetTags.length > 0

    return (
        <Accordion label="Workstation Details" id="workstationDetails">
            <AssignmentSectionContent>
                {workstationAssetTags.map((assetTag) => (
                    <AssignmentItem key={assetTag}>
                        <TextField label="Asset Tag"
                                   name="workstationAssetTags"
                                   isReadOnly
                                   value={assetTag}
                        >
                        </TextField>

                        <AssignmentActionRow>
                            <Button
                                type="button"
                                variant="secondary"
                                danger
                                onPress={() => handleRemoveWorkstation(assetTag)}
                            >
                                Remove Workstation
                            </Button>
                        </AssignmentActionRow>
                    </AssignmentItem>
                ))}

                <AssignmentActionRow>
                    <Button type="button"
                            variant="secondary"
                            onPress={handleAssignWorkstation}>
                        {hasWorkstations ? "Add Workstation" : "Assign Workstation"}
                    </Button>
                </AssignmentActionRow>
            </AssignmentSectionContent>
        </Accordion>
    )
}
