import {Accordion, Button, ButtonGroup, TextField} from "@bcgov/design-system-react-components";
import {PressEvent} from "@react-types/shared";


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
            <div>
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

                <ButtonGroup>
                    <Button variant="secondary"
                            onPress={handleAssignMobileDevice}
                    >
                        {hasMobileDeviceAssignment ? "Update" : "Assign"}
                    </Button>

                    {hasMobileDeviceAssignment && (
                        <Button variant="secondary"
                                danger
                                onPress={handleRemoveMobileDevice}
                        >
                            Remove Mobile Device
                        </Button>
                    )}
                </ButtonGroup>
            </div>
        </Accordion>
    )
}