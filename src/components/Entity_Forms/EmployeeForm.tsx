import {useActionState, useEffect, useState} from "react";

import {PressEvent} from "@react-types/shared";

import {
    Accordion,
    AccordionGroup,
    Button,
    ButtonGroup,
    Callout,
    Form,
    Select,
    TextArea,
    TextField
} from "@bcgov/design-system-react-components";

import {addNewEmployeeAction, updateEmployeeAction} from "@/actions/employees";

import {useBranches} from "@/hooks/lookups/useBranches";
import {useProgramAreas} from "@/hooks/lookups/useProgramAreas";

import {EmployeeFormState, EntityActionResult} from "@/types";

import {
    validateEmployeeIdField,
    validateEmployeeNameField,
    validateNotesField,
    validateEmployeeIdirField,
} from "@/validators";


interface EmployeeFormProps {
    employee: EmployeeFormState | undefined
    activateAssignMode: (formData: FormData) => Promise<void>
    onSuccess: () => void
    onError: (error: string) => void
    // optional prop only passed in edit mode
    onDelete?: () => void
    onClose: () => void
}

export function EmployeeForm({
                                 employee,
                                 activateAssignMode,
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

    const initialSelectedBranchId = employee?.ui_branch_id ?? employee?.program_area?.branch_id
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(initialSelectedBranchId);

    const {programAreas} = useProgramAreas(selectedBranchId);

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

    const handleAssignOffice = async (e: PressEvent) => {

        // Find the nearest form element
        const formElement = e.target.closest('form')

        if (formElement) {
            await activateAssignMode(new FormData(formElement))
        }
    }

    return (
        <Form action={formAction}
              style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // gap: '0.5rem',
              }}>

            <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={["employeeDetails"]} style={{
                marginTop: "1rem",
                marginBottom: "1rem",
            }}>

                <Accordion label="Employee Details" id="employeeDetails">

                    <div>
                        <TextField label="First Name"
                                   name="firstName"
                                   isRequired
                                   validate={value => validateEmployeeNameField(value, "First Name")}
                                   defaultValue={employee?.first_name}>
                        </TextField>

                        <TextField label="Last Name"
                                   name="lastName"
                                   isRequired
                                   validate={value => validateEmployeeNameField(value, "Last Name")}
                                   defaultValue={employee?.last_name}>
                        </TextField>

                        <TextField label="Employee ID"
                                   name="employeeId"
                                   isRequired
                                   validate={validateEmployeeIdField}
                                   isReadOnly={isEditMode} // lock the field in edit mode
                                   defaultValue={employee?.employee_id}>
                        </TextField>

                        <TextField label="IDIR"
                                   name="idir"
                                   description="If IDIR is unknown, leave this field blank"
                                   validate={validateEmployeeIdirField}
                                   isReadOnly={isEditMode && !!employee?.idir} // idir can't be changed once it is
                            // set for an employee
                                   defaultValue={employee?.idir ?? undefined}>
                        </TextField>

                        <TextField label="Alternate Name"
                                   name="alternateName"
                                   validate={value => validateEmployeeNameField(
                                       value,
                                       "Alternate Name",
                                       {
                                           required: false,
                                       }
                                   )
                                   }
                                   defaultValue={employee?.alternate_name ?? undefined}>
                        </TextField>

                        <Select
                            label="Branch"
                            name="branch"
                            isRequired
                            items={(branches ?? []).map(branch => (
                                {
                                    id: branch.id,
                                    label: branch.name,
                                }
                            ))}
                            selectedKey={selectedBranchId}
                            onSelectionChange={(key) =>
                                setSelectedBranchId(key == null ? undefined : Number(key))
                            }
                            placeholder="Select a Branch"
                        >
                        </Select>

                        <Select
                            label="Program Area"
                            name="programArea"
                            isRequired
                            isDisabled={!selectedBranchId}
                            items={(programAreas ?? []).map(programArea => (
                                {
                                    id: programArea.id,
                                    label: programArea.name,
                                }
                            ))}
                            defaultSelectedKey={employee ? employee.program_area_id : undefined}
                            placeholder="Select a Program Area"
                        >
                        </Select>

                        <TextArea label="Notes"
                                  name="notes"
                                  maxLength={2000}
                                  validate={validateNotesField}
                                  defaultValue={employee?.notes ?? undefined}>
                        </TextArea>
                    </div>

                </Accordion>

                <Accordion label="Office Details" id="officeDetails">
                    <div>
                        <div style={{
                            marginBottom: "1rem",
                        }}>
                            <Callout
                                description={`Click on the ${employee?.office_number ? "Update" : "Assign"} Office button to select an office for this employee. Note that the selected office will only be linked on clicking the ${isEditMode ? "Save" : "Create"} button below`}>
                            </Callout>
                        </div>

                        <TextField label="Office Number"
                                   name="officeNumber"
                                   isRequired
                                   isReadOnly
                                   defaultValue={employee?.office_number}/>
                        <Button variant="secondary"
                                onPress={handleAssignOffice}
                        >{employee?.office_number ? "Update" : "Assign"} Office</Button>
                    </div>
                </Accordion>
            </AccordionGroup>

            {/*<div style={{backgroundColor: "gray"}}>*/}
            <ButtonGroup>
                <Button type="submit" isDisabled={isPending}>{isEditMode ? "Save" : "Create"}</Button>
                <Button variant="secondary"
                        onPress={onClose}>Cancel</Button>
            </ButtonGroup>
            {/*</div>*/}

            {/* Only render the delete button in the edit modal */}
            {isEditMode ? (
                <ButtonGroup alignment="end">
                    <Button variant="secondary"
                            danger
                            onPress={onDelete}
                    >Delete</Button>
                </ButtonGroup>
            ) : null}

        </Form>
    )
}
