import type {Office} from "@/generated/prisma/client";

import {OfficeDetails} from "@/components/Entity_Forms/Office/OfficeDetails";
import {useOfficeLookupProps} from "@/components/Entity_Forms/Office/useOfficeLookupProps";
import {Address} from "@/components/Entity_Forms/Office/Address";
import {AccordionGroup} from "@bcgov/design-system-react-components";


interface OfficeFormProps {
    office: Office;
}

export function OfficeForm({office}: OfficeFormProps) {

    const officeLookupProps = useOfficeLookupProps();

    return (
        <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={["officeDetails", "address"]} style={{
            marginTop: "1rem",
            marginBottom: "1rem",
        }}>
            <OfficeDetails office ={office}
                           {...officeLookupProps}
            >
            </OfficeDetails>

            <Address address={office.address}
                     city={office.city}
                     postalCode={office.postal_code}>
            </Address>
        </AccordionGroup>
    )
}
