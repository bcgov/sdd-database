import {Button, ButtonGroup, Form, TextArea, TextField} from "@bcgov/design-system-react-components";

import {Workstation} from "@prisma/client";


interface WorkstationFormProps {
    onSubmit: (formData: FormData) => void
    workstation?: Workstation
    onClose: () => void
}

export function WorkstationForm({onSubmit, workstation, onClose}: WorkstationFormProps) {

    // workstation is only passed in edit mode
    const isEditMode = !!workstation;

    return (
        <Form action={onSubmit}>
            <TextField label="Asset Tag"
                       name="assetTag"
                       isRequired
                        // lock in edit mode
                       isReadOnly={isEditMode}
                       defaultValue={workstation?.asset_tag}/>
            <TextArea label="Notes" name="notes" defaultValue={workstation?.notes ?? undefined}/>

            <ButtonGroup>
                <Button type="submit">{isEditMode ? "Save" : "Create"}</Button>
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
            </ButtonGroup>

        </Form>
    )
}
