import {Accordion, Button, TextField} from "@bcgov/design-system-react-components";
import {PressEvent} from "@react-types/shared";
import {
    AssignmentActionRow,
    AssignmentSectionContent
} from "@/components/EntityForms/Shared/AssignmentSectionLayout";


interface MobileDeviceDetailsProps {
    mobileDeviceId: number | undefined
    mobileDeviceTitle: string

    hasMobileDeviceAssignment: boolean
    handleAssignMobileDevice: (e: PressEvent) => Promise<void>
    handleRemoveMobileDevice: () => void
}

export function MobileDeviceDetails({
                                        mobileDeviceId,
                                        mobileDeviceTitle,

                                        hasMobileDeviceAssignment,
                                        handleAssignMobileDevice,
                                        handleRemoveMobileDevice,
                                    }: MobileDeviceDetailsProps) {
    return (
        <Accordion label="Mobile Device Details"
                   id="mobileDeviceDetails"
        >
            <AssignmentSectionContent>
                <TextField label="Mobile Device"
                           isReadOnly
                           value={mobileDeviceTitle}
                >
                </TextField>

                {mobileDeviceId !== undefined && (
                    <input type="hidden"
                           name="mobileDeviceId"
                           value={mobileDeviceId}
                    >
                    </input>
                )}

                <AssignmentActionRow>
                    <Button type="button"
                            variant="secondary"
                            onPress={handleAssignMobileDevice}
                    >
                        {hasMobileDeviceAssignment ? "Update" : "Assign"} Mobile Device
                    </Button>

                    {hasMobileDeviceAssignment && (
                        <Button type="button"
                                variant="secondary"
                                danger
                                onPress={handleRemoveMobileDevice}
                        >
                            Remove Mobile Device
                        </Button>
                    )}
                </AssignmentActionRow>
            </AssignmentSectionContent>
        </Accordion>
    )
}
