import {useActionState, useEffect, useState} from "react";

import {PressEvent} from "@react-types/shared";

import {
    AccordionGroup,
    Button,
    ButtonGroup,
    Form,
} from "@bcgov/design-system-react-components";

import {addNewEmployeeAction, updateEmployeeAction} from "@/actions/entities/employees";

import {useBranches} from "@/hooks/lookups/useBranches";
import {useProgramAreas} from "@/hooks/lookups/useProgramAreas";

import {AssignMode, EmployeeFormValues, EmployeeSearchResult, EntityActionResult} from "@/types";

import {WorkspaceSection} from "@/components/Entity_Forms/Employee/WorkspaceSection";
import {OfficeSection} from "@/components/Entity_Forms/Employee/OfficeSection";
import {EmployeeSection} from "@/components/Entity_Forms/Employee/EmployeeSection";


interface EmployeeFormProps {
    employee: EmployeeFormValues | EmployeeSearchResult | undefined
    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>
    handleRemoveWorkspace: () => void
    onSuccess: () => void
    onError: (error: string) => void
    // optional prop only passed in edit mode
    onDelete?: () => void
    onClose: () => void
}

export function EmployeeForm({
                                 employee,
                                 activateAssignMode,
                                 handleRemoveWorkspace,
                                 onSuccess,
                                 onError,
                                 onDelete,
                                 onClose
                             }: EmployeeFormProps) {

    const isEditMode = !!onDelete;

    const initialState: EntityActionResult = {status: "idle"};

    const serverAction = isEditMode ? updateEmployeeAction : addNewEmployeeAction;

    const [result, formAction, isPending] = useActionState(serverAction, initialState)

    const {branches} = useBranches(); // [{ id, name }, {id, name}] or null on first render

    const uiBranchId = employee && "ui_branch_id" in employee
        ? employee.ui_branch_id
        : undefined
    const hydratedBranchId = employee && "program_area" in employee
        ? employee.program_area?.branch_id
        : undefined
    const initialSelectedBranchId = uiBranchId ?? hydratedBranchId

    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(initialSelectedBranchId);

    const {programAreas} = useProgramAreas(selectedBranchId);

    const hasOfficeAssignment = !!employee?.office_number

    const uiWorkspaceNumber = employee && "ui_workspace_number" in employee
        ? employee.ui_workspace_number
        : undefined

    const workspace = employee && "workspace" in employee
        ? employee.workspace
        : null

    const workspaceNumber = uiWorkspaceNumber ?? workspace?.workspace_number ?? "Unassigned"

    const hasWorkspaceAssignment = !!(uiWorkspaceNumber || workspace?.workspace_number)

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

    const handleAssign = async (mode: AssignMode, e: PressEvent) => {
        const formElement = e.target.closest("form")

        if (formElement) {
            await activateAssignMode(mode, new FormData(formElement))
        }
    }

    return (
        <Form action={formAction}
              style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // gap: '0.5rem',
              }}>

            {/* pass employee.id through FormData in edit mode */}
            {isEditMode && employee?.id !== undefined ? (
                <input type="hidden" name="id" value={employee.id}/>
            ) : null}

            <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={["employeeDetails"]} style={{
                marginTop: "1rem",
                marginBottom: "1rem",
            }}>

                <EmployeeSection
                    employee={employee}
                    branches={branches ?? []}
                    programAreas={programAreas ?? []}
                    selectedBranchId={selectedBranchId}
                    setSelectedBranchId={setSelectedBranchId}
                    isEditMode={isEditMode}>
                </EmployeeSection>

                <OfficeSection
                    officeNumber={employee?.office_number}
                    isEditMode={isEditMode}
                    handleAssignOffice={(e) => handleAssign("office", e)}>
                </OfficeSection>

                <WorkspaceSection
                    workspaceNumber={workspaceNumber}
                    hasOfficeAssignment={hasOfficeAssignment}
                    hasWorkspaceAssignment={hasWorkspaceAssignment}
                    handleAssignWorkspace={(e) => handleAssign("workspace", e)}
                    handleRemoveWorkspace={handleRemoveWorkspace}>
                </WorkspaceSection>
            </AccordionGroup>

            {/*<div style={{backgroundColor: "gray"}}>*/}
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
            {/*</div>*/}

            {/* Only render the delete button in the edit modal */}
            {isEditMode ? (
                <ButtonGroup alignment="end">
                    <Button size="large"
                            variant="secondary"
                            danger
                            onPress={onDelete}>
                        Delete
                    </Button>
                </ButtonGroup>
            ) : null}

        </Form>
    )
}
