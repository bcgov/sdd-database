import {useActionState, useEffect} from "react";

import {Button, ButtonGroup, Form, TextArea, TextField} from "@bcgov/design-system-react-components";

import {Workstation} from "@prisma/client";

import {addNewWorkstationAction, updateWorkstationAction} from "@/actions/workstations";

import {EntityActionResult} from "@/types";

import {validateAssetTagField, validateNotesField} from "@/validators";


interface WorkstationFormProps {
    workstation?: Workstation
    onSuccess: () => void
    onError: (error: string) => void
    onClose: () => void
}

export function WorkstationForm({workstation, onSuccess, onError, onClose}: WorkstationFormProps) {

    // workstation is only passed in edit mode
    const isEditMode = !!workstation;

    const initialState: EntityActionResult = {status: "idle"};

    const serverAction = isEditMode ? updateWorkstationAction : addNewWorkstationAction;

    const [result, formAction, isPending] = useActionState(serverAction, initialState);

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
            <TextField label="Asset Tag"
                       name="assetTag"
                       isRequired
                // lock in edit mode
                validate={validateAssetTagField}
                       isReadOnly={isEditMode}
                       defaultValue={workstation?.asset_tag}>
            </TextField>

            <TextArea label="Notes"
                      name="notes"
                      maxLength={2000}
                      validate={validateNotesField}
                      defaultValue={workstation?.notes ?? undefined}/>

            <ButtonGroup>
                <Button type="submit" isDisabled={isPending}>{isEditMode ? "Save" : "Create"}</Button>
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
            </ButtonGroup>

        </Form>
    )
}
