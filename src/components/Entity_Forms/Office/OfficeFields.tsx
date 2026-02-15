import type {Office} from "@/generated/prisma/client";

import {LookupOption} from "@/types";

import {Select, TextField} from "@bcgov/design-system-react-components";


interface OfficeFieldsProps {
    office: Office;
    officeTypes: LookupOption[];
    typesOfClientServices: LookupOption[];
    isReadOnly: boolean;
}

export function OfficeFields({
                          office,
                          officeTypes,
                          typesOfClientServices,
                          isReadOnly
                      }: OfficeFieldsProps) {
    return (
        <>
            <TextField label="Office Number"
                       name="officeNumber"
                       isReadOnly={isReadOnly}
                       defaultValue={office.office_number}>
            </TextField>

            <TextField label="Name"
                       name="officeName"
                       isReadOnly={isReadOnly}
                       defaultValue={office.office_name}>
            </TextField>

            <Select label="Type"
                    name="type"
                    items={officeTypes.map(type => (
                        {
                            id: type.id,
                            label: type.name
                        }
                    ))}
                    isDisabled={isReadOnly}
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
                    isDisabled={isReadOnly}
                    defaultValue={office.client_service_type_id}>
            </Select>

            <TextField label="Address"
                       name="address"
                       isReadOnly={isReadOnly}
                       defaultValue={office.address}>
            </TextField>

            <TextField label="City"
                       name="city"
                       isReadOnly={isReadOnly}
                       defaultValue={office.city}>
            </TextField>

            <TextField label="Postal Code"
                       name="postalCode"
                       isReadOnly={isReadOnly}
                       defaultValue={office.postal_code}>
            </TextField>
        </>
    )
}
