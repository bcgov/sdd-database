import {Accordion, TextArea, TextField} from "@bcgov/design-system-react-components";
import {MobileDeviceFormValues} from "@/types";
import {validateImeiField, validateNotesField} from "@/validators";


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

                <TextArea label="Notes"
                          name="notes"
                          maxLength={200}
                          validate={validateNotesField}
                          defaultValue={mobileDevice?.notes ?? undefined}>
                </TextArea>
            </div>
        </Accordion>
    )
}
