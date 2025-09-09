import {useActionState, useEffect} from "react";

import {Button, ButtonGroup, Form, TextArea, TextField} from "@bcgov/design-system-react-components";

import {Office} from "@prisma/client";

import {updateOfficeAction} from "@/actions/offices";

import {validateNotesField} from "@/validators";

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

            <TextField label="Office Name" name="officeName" isReadOnly defaultValue={office.office_name}/>
            
            <TextField label="Office Type" name="officeType" isReadOnly defaultValue={office.office_type}/>

            <TextField label="Postal Code" name="postalCode" isReadOnly defaultValue={office.postal_code}/>

            <TextArea
                label="Notes"
                name="notes"
                maxLength={2000}
                validate={validateNotesField}
                defaultValue={office.notes ?? undefined}>
            </TextArea>

            <ButtonGroup>
                <Button type="submit" isDisabled={isPending}>Save</Button>
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
            </ButtonGroup>
        </Form>
    )
}
