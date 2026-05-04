import type {Office} from "@/generated/prisma/client";

import {LookupOption} from "@/types";

import {Accordion, Select, TextField} from "@bcgov/design-system-react-components";


interface OfficeDetailsProps {
    office: Office;
    officeTypes: LookupOption[];
    typesOfClientServices: LookupOption[];
}

export function OfficeDetails({
                                  office,
                                  officeTypes,
                                  typesOfClientServices,
                              }: OfficeDetailsProps) {
    return (
        <Accordion label="Office Details" id="officeDetails">
            <div>
                <TextField label="Office Number"
                           name="officeNumber"
                           isReadOnly
                           defaultValue={office.office_number}>
                </TextField>

                <TextField label="Office Name"
                           name="officeName"
                           isReadOnly
                           defaultValue={office.office_name}>
                </TextField>

                <Select label="Type of Office"
                        name="type"
                        items={officeTypes.map(type => (
                            {
                                id: type.id,
                                label: type.name
                            }
                        ))}
                        isDisabled
                        defaultValue={office.type_id}>
                </Select>

                <Select label="Type of Client Services"
                        name="typeOfClientServices"
                        items={typesOfClientServices.map(typeOfClientService => (
                            {
                                id: typeOfClientService.id,
                                label: typeOfClientService.name
                            }
                        ))}
                        isDisabled
                        defaultValue={office.client_service_type_id}>
                </Select>
            </div>
        </Accordion>
    )
}
