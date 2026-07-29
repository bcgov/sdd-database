import { Accordion, TextField } from "@bcgov/design-system-react-components"
import {formatMobilePlanPhoneNumber} from "@/domain/mobilePlans";


interface MobilePlanDetailsProps {
    phoneNumber: string
}

export function MobilePlanDetails({
                                      phoneNumber
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
        </Accordion>
    )
}
