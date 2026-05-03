import {
    AccordionGroup, Button, ButtonGroup,
    Form,
} from "@bcgov/design-system-react-components";

import {WorkstationDetails} from "@/components/Entity_Forms/Workstation/WorkstationDetails";
import {EntityActionResult, WorkstationSearchResult} from "@/types";
import {AssignedEmployeeDetails} from "@/components/Entity_Forms/Shared/AssignedEmployeeDetails";
import {useWorkstationLookupProps} from "@/components/Entity_Forms/Workstation/useWorkstationLookupProps";
import {addNewWorkstationAction, updateWorkstationAction} from "@/actions/entities/workstation/actions";
import {useActionState, useEffect} from "react";


interface WorkstationFormProps {
    workstation?: WorkstationSearchResult

    onSuccess: () => void
    onError: (error: string) => void

    onClose: () => void
}

export function WorkstationForm({
                                    workstation,

                                    onSuccess,
                                    onError,

                                    onClose
                                }: WorkstationFormProps) {

    const isEditMode = !!workstation

    const initialState: EntityActionResult = {status: "idle"}

    const serverAction = isEditMode ? updateWorkstationAction : addNewWorkstationAction

    const [result, formAction, isPending] = useActionState(serverAction, initialState)

    const workstationLookupProps = useWorkstationLookupProps()

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

    const hasAssignedEmployee = !!workstation?.assigned_employee

    return (
        <Form action={formAction}>
            <AccordionGroup allowsMultipleExpanded
                            defaultExpandedKeys={
                isEditMode? ["workstationDetails", "assignedEmployeeDetails"]
            : ["workstationDetails"]
            }
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem"
                            }}>
                <WorkstationDetails workstation={workstation}
                                    {...workstationLookupProps}
                                    isAssetTagReadOnly={isEditMode}
                                    isModelReadOnly={isEditMode}
                                    isOfficeNumberReadOnly={isEditMode && hasAssignedEmployee}
                                    isNotesReadOnly={false}
                >
                </WorkstationDetails>

                {workstation?.assigned_employee &&
                    <AssignedEmployeeDetails assignedEmployee={workstation.assigned_employee}/>}
            </AccordionGroup>

            <ButtonGroup>
                <Button type="submit"
                        size="large"
                        isDisabled={isPending}>
                    {isEditMode ? "Save" : "Create"}
                </Button>
                <Button size="large"
                        variant="secondary"
                        onPress={onClose}>
                    Cancel
                </Button>
            </ButtonGroup>
        </Form>
    )
}
