import {useActionState, useEffect} from "react";

import {Button, ButtonGroup, Form, Select, TextField} from "@bcgov/design-system-react-components";

import type {Office} from "@/generated/prisma/client";

import {updateOfficeAction} from "@/actions/offices";

import {useOfficeTypes} from "@/hooks/lookups/useOfficeTypes";
import {useTypesOfClientServices} from "@/hooks/lookups/useTypesOfClientServices";

import {EntityActionResult} from "@/types";


interface OfficeFormProps {
    // This is not Optional as OfficeForm can only be opened in edit mode. There is no addNewOffice Modal as of now
    office: Office;
    onSuccess: () => void;
    onError: (error: string) => void;
    onClose: () => void;
}

export function OfficeForm({office, onSuccess, onError, onClose}: OfficeFormProps) {

    const initialState: EntityActionResult = {
        status: "idle"
    }

    const [result, formAction, isPending] = useActionState(updateOfficeAction, initialState)

    const {officeTypes} = useOfficeTypes(); // [{ id, name }, {id, name}] or null on first render
    const {typesOfClientServices} = useTypesOfClientServices();

    useEffect(() => {

        switch (result.status) {
            case "idle":
                // first render -> do nothing
                return;

            case "ok":
                onSuccess();
                break;

            case "error":
                onError(result.error);
                break;
        }
    }, [result, onError, onSuccess]);

    return (
        <Form action={formAction}>

            <TextField label="Office Number"
                       name="officeNumber"
                       isReadOnly
                       defaultValue={office.office_number}>
            </TextField>

            <TextField label="Name" name="officeName" isReadOnly defaultValue={office.office_name}/>

            <Select label="Type"
                    name="type"
                    items={(officeTypes ?? []).map(type => (
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
                    items={(typesOfClientServices ?? []).map(typeOfClientService => (
                        {
                            id: typeOfClientService.id,
                            label: typeOfClientService.name
                        }
                    ))}
                    isDisabled
                    defaultValue={office.client_service_type_id}>
            </Select>

            <TextField label="Address" name="address" isReadOnly defaultValue={office.address}/>

            <TextField label="City" name="city" isReadOnly defaultValue={office.city}/>

            <TextField label="Postal Code" name="postalCode" isReadOnly defaultValue={office.postal_code}/>

            <ButtonGroup>
                <Button type="submit" isDisabled={isPending}>Save</Button>
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
            </ButtonGroup>
        </Form>
    )
}
