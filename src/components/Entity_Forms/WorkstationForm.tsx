import {Button, ButtonGroup, Form, TextArea, TextField} from "@bcgov/design-system-react-components";


interface WorkstationFormProps {
    onSubmit: (formData: FormData) => void
    onClose: () => void
}

export function WorkstationForm({onSubmit, onClose}: WorkstationFormProps) {
    return (
        <Form action={onSubmit}>
            <TextField label="Asset Tag" name="assetTag" isRequired/>
            <TextArea label="Notes" name="notes"/>

            <ButtonGroup>
                <Button type="submit">{"Create"}</Button>
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
            </ButtonGroup>

        </Form>
    )
}