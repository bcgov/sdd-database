import {PressEvent} from "@react-types/shared";
import {Accordion, Button, Callout, TextField} from "@bcgov/design-system-react-components";

interface OfficeSectionProps {
    officeNumber: string | undefined
    hasOfficeAssignment: boolean
    isEditMode: boolean
    handleAssignOffice: (e: PressEvent) => Promise<void>
}

export function OfficeSection({
    officeNumber,
    hasOfficeAssignment,
    isEditMode,
    handleAssignOffice
}: OfficeSectionProps) {
    return (
        <Accordion label="Office Details" id="officeDetails">
            <div>
                <div style={{
                    marginBottom: "1rem",
                }}>
                    <Callout
                        description={`Click on the ${hasOfficeAssignment ? "Update" : "Assign"} Office button to select an office for this employee. Note that the selected office will only be linked on clicking the ${isEditMode ? "Save" : "Create"} button below`}>
                    </Callout>
                </div>

                <TextField label="Office Number"
                           name="officeNumber"
                           isRequired
                           isReadOnly
                           defaultValue={officeNumber}/>

                <Button variant="secondary"
                        onPress={handleAssignOffice}
                >{hasOfficeAssignment ? "Update" : "Assign"} Office</Button>
            </div>
        </Accordion>
    )
}
