import {PressEvent} from "@react-types/shared";

import {
    Accordion,
    AccordionGroup,
    Button,
    ButtonGroup,
    Callout,
    Form,
    TextArea,
    TextField
} from "@bcgov/design-system-react-components";

import {Employee} from "@prisma/client";


interface EmployeeFormProps {
    onSubmit: (formData: FormData) => void
    employee: Employee | undefined;
    activateAssignMode: (formData: FormData) => Promise<void>
    onClose: () => void
    // optional prop only passed in edit mode
    onDelete?: () => void
}

export function EmployeeForm({
                                 onSubmit,
                                 employee,
                                 activateAssignMode,
                                 onClose,
                                 onDelete
                             }: EmployeeFormProps) {

    const handleAssignOffice = async (e: PressEvent) => {

        // Find the nearest form element
        const formElement = e.target.closest('form')

        if (formElement) {
            await activateAssignMode(new FormData(formElement))
        }
    }

    const isEditMode = !!onDelete;

    return (
        <Form action={onSubmit}
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
                                   validate={
                                       (value) => {

                                           if (!value) {
                                               return "This is a mandatory field";
                                           }

                                           if(value.length > 30) {
                                               return "First name cannot be longer than 30 characters";
                                           }

                                           if(/\s/.test(value)) {
                                                  return "First name must be a single word (no spaces)";
                                             }

                                           if (!/^[A-Za-z]*$/.test(value)) {
                                               return "First name can contain only alphabets";
                                           }

                                           return null; // valid, no error
                                       }}
                                   defaultValue={employee?.first_name}>
                        </TextField>

                        <TextField label="Last Name"
                                   name="lastName"
                                   isRequired
                                   defaultValue={employee?.last_name}></TextField>

                        <TextField label="Employee ID"
                                   name="employeeId"
                                   isRequired
                                   isReadOnly={isEditMode} // lock the field in edit mode
                                   defaultValue={employee?.employee_id}/>

                        <TextField label="IDIR"
                                   name="idir"
                                   isRequired
                                   isReadOnly={isEditMode} // lock the field in edit mode
                                   defaultValue={employee?.idir}/>

                        <TextField label="Alternate Name"
                                   name="alternateName"
                                   defaultValue={employee?.alternate_name ?? undefined}></TextField>

                        <TextArea label="Notes" name="notes" defaultValue={employee?.notes ?? undefined}></TextArea>
                    </div>

                </Accordion>

                <Accordion label="Office Details" id="officeDetails">
                    <div>
                        <div style={{
                            marginBottom: "1rem",
                        }}>
                            <Callout
                                description={`Click on the ${employee?.office_number ? "Update" : "Assign"} Office button to select an office for this employee. Note that the selected office will only be linked on clicking the Save button below`}></Callout>
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
                <Button type="submit">{isEditMode ? "Save" : "Create"}</Button>
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
