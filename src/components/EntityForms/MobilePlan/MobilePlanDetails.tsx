import {Accordion, TextField, ToggleButton, ToggleButtonGroup} from "@bcgov/design-system-react-components"
import {formatMobilePlanPhoneNumber} from "@/domain/mobilePlans";


interface MobilePlanDetailsProps {
    phoneNumber: string
    planStatus: string
}

export function MobilePlanDetails({
                                      phoneNumber,
                                      planStatus,
                                  }: MobilePlanDetailsProps) {

    return (
        <Accordion label="Mobile Plan Details"
                   id="mobilePlanDetails"
        >
            <div>
                <TextField label="Phone Number"
                           isReadOnly
                           defaultValue={formatMobilePlanPhoneNumber(phoneNumber)}
                >
                </TextField>
            </div>

            <div style={{width: "fit-content", marginBottom: "0.5rem"}}>
                <ToggleButtonGroup label="Plan Status"
                                   isDisabled
                                   disallowEmptySelection
                                   selectedKeys={[planStatus]}
                                   style={{width: "fit-content"}}
                >
                    <ToggleButton id="Active">Active</ToggleButton>
                    <ToggleButton id="Suspended">Suspended</ToggleButton>
                    <ToggleButton id="Cancelled">Cancelled</ToggleButton>
                    <ToggleButton id="Investigate">Investigate</ToggleButton>
                </ToggleButtonGroup>
            </div>
        </Accordion>
    )
}
