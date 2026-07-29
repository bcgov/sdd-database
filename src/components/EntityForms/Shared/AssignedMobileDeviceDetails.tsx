import {Accordion, TextField} from "@bcgov/design-system-react-components"


interface AssignedMobileDeviceDetailsProps {
    assignedMobileDevice: {
        imei: string | null
        mobile_device_model: {
            name: string
        }
    }
}

export function AssignedMobileDeviceDetails({
                                                assignedMobileDevice,
                                            }: AssignedMobileDeviceDetailsProps) {
    return (
        <Accordion label="Assigned Mobile Device Details"
                   id="assignedMobileDeviceDetails"
        >
            <div>
                <TextField label="Model"
                           isReadOnly
                           defaultValue={assignedMobileDevice.mobile_device_model.name}
                >
                </TextField>

                {assignedMobileDevice.imei && (
                    <TextField label="IMEI"
                               isReadOnly
                               defaultValue={assignedMobileDevice.imei}
                    >
                    </TextField>
                )}
            </div>
        </Accordion>
    )
}
