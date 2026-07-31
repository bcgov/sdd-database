import {PressEvent} from "@react-types/shared";
import {Accordion, Button, Callout, TextField} from "@bcgov/design-system-react-components";
import {
    AssignmentActionRow,
    AssignmentSectionContent
} from "@/components/EntityForms/Employee/AssignmentSectionLayout";

interface OfficeDetailsProps {
    officeNumber: string | undefined
    hasOfficeAssignment: boolean
    isEditMode: boolean
    handleAssignOffice: (e: PressEvent) => Promise<void>
}

export function OfficeDetails({
    officeNumber,
    hasOfficeAssignment,
    isEditMode,
    handleAssignOffice
}: OfficeDetailsProps) {
    return (
        <Accordion label="Office Details" id="officeDetails">
            <AssignmentSectionContent>
                <Callout
                    description={`Click on the ${hasOfficeAssignment ? "Update" : "Assign"} Office button to select an office for this employee. Note that the selected office will only be linked on clicking the ${isEditMode ? "Save" : "Create"} button below`}>
                </Callout>

                <TextField label="Office Number"
                           name="officeNumber"
                           isRequired
                           isReadOnly
                           value={officeNumber}/>

                <AssignmentActionRow>
                    <Button type="button"
                            variant="secondary"
                            onPress={handleAssignOffice}
                    >
                        {hasOfficeAssignment ? "Update" : "Assign"} Office
                    </Button>
                </AssignmentActionRow>
            </AssignmentSectionContent>
        </Accordion>
    )
}
