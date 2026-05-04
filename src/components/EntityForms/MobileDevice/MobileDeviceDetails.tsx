import {Accordion, TextField} from "@bcgov/design-system-react-components";
import {MobileDeviceFormValues} from "@/types";
import {validateImeiField} from "@/validators";


interface MobileDeviceDetailsProps {
    mobileDevice?: MobileDeviceFormValues
    isEditMode: boolean
}

export function MobileDeviceDetails({
                                        mobileDevice,
                                        isEditMode,
                                    }: MobileDeviceDetailsProps) {

    return (
        <Accordion label="Mobile Device Details"
                   id="mobileDeviceDetails"
        >
            <div>
                <TextField label="IMEI"
                           name="imei"
                           isRequired
                           isReadOnly={isEditMode}
                           validate={validateImeiField}
                           defaultValue={mobileDevice?.imei}
                >
                </TextField>
            </div>
        </Accordion>
    )
}
