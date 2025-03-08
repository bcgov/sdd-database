import {Button, ButtonGroup, Form, TextArea, TextField} from "@bcgov/design-system-react-components";
import {Office} from "@prisma/client";

interface OfficeFormProps {
    onSubmit: (formData: FormData) => void;
    // This is not Optional as OfficeForm can only be opened in edit mode. There is no addNewOffice Modal as of now
    office: Office;
    onClose: () => void;
}

export function OfficeForm({onSubmit, office, onClose}: OfficeFormProps) {
    return (
        <Form action={onSubmit}>
            <TextField label="Office Number" name="officeNumber" isReadOnly defaultValue={office.office_number}/>

            <TextField label="Office Name" name="officeName" isReadOnly defaultValue={office.office_name}/>

            <TextField label="Postal Code" name="postalCode" isReadOnly defaultValue={office.postal_code}/>

            <TextArea label="Notes" name="notes" defaultValue={office.notes ?? undefined}></TextArea>

            <ButtonGroup>
                <Button type="submit">Save</Button>
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
            </ButtonGroup>
        </Form>
    )
}
