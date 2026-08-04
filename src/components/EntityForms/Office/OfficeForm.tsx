import type {Office} from "@/generated/prisma/client";

import {OfficeDetails} from "@/components/EntityForms/Office/OfficeDetails";
import {useOfficeLookupProps} from "@/components/EntityForms/Office/useOfficeLookupProps";
import {Address} from "@/components/EntityForms/Office/Address";
import {AccordionGroup} from "@bcgov/design-system-react-components";
import {ModalContentLayout} from "@/components/ModalContentLayout";


interface OfficeFormProps {
    office: Office;
}

export function OfficeForm({office}: OfficeFormProps) {

    const officeLookupProps = useOfficeLookupProps();

    return (
        <ModalContentLayout>
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
        </ModalContentLayout>
    )
}
