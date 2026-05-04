import {Accordion, TextField} from "@bcgov/design-system-react-components";


interface AddressProps {
    address: string
    city: string
    postalCode: string
}

export function Address({
                            address,
                            city,
                            postalCode,
                        }: AddressProps) {
    return (
        <Accordion label="Address" id="address">
            <div>
                <TextField label="Street Address"
                           name="address"
                           isReadOnly
                           defaultValue={address}>
                </TextField>

                <TextField label="City"
                           name="city"
                           isReadOnly
                           defaultValue={city}>
                </TextField>

                <TextField label="Postal Code"
                           name="postalCode"
                           isReadOnly
                           defaultValue={postalCode}>
                </TextField>
            </div>
        </Accordion>
    )
}
