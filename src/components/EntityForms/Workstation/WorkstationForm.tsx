import {
    AccordionGroup, Button, ButtonGroup,
    Form,
} from "@bcgov/design-system-react-components";

import {WorkstationDetails} from "@/components/EntityForms/Workstation/WorkstationDetails";
import {WorkstationSearchResult} from "@/types";
import {AssignedEmployeeDetails} from "@/components/EntityForms/Shared/AssignedEmployeeDetails";
import {useWorkstationLookupProps} from "@/components/EntityForms/Workstation/useWorkstationLookupProps";
import {addNewWorkstationAction, updateWorkstationAction} from "@/actions/entities/workstation/actions";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";


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

    const serverAction = isEditMode ? updateWorkstationAction : addNewWorkstationAction

    const {formAction, isPending} = useEntityFormActionState({
        serverAction,
        onSuccess,
        onError
    })

    const workstationLookupProps = useWorkstationLookupProps()

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
