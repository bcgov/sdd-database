import {
    Accordion,
    AccordionGroup,
    Button,
    ButtonGroup,
    Form,
    TextArea,
    TextField
} from "@bcgov/design-system-react-components";
import {Employee} from "@prisma/client";


interface EmployeeFormProps {
    onSubmit: (formData: FormData) => void;
    employee?: Employee;    // Optional: Passed only in edit mode
    onCancel: () => void;
    onDelete?: () => void;
}

export function EmployeeForm({onSubmit, employee, onCancel, onDelete}: EmployeeFormProps) {

    return (
        <Form action={onSubmit}
              style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // gap: '0.5rem',
              }}>

            <AccordionGroup>

                <Accordion label="Employee Details">
                </Accordion>

                <Accordion label="Office Details"></Accordion>

            </AccordionGroup>

            <TextField label="First Name"
                       name="firstName"
                       isRequired
                       defaultValue={employee?.first_name}/>

            <TextField label="Middle Name" name="middleName" defaultValue={employee?.middle_name ?? undefined}></TextField>

            <TextField label="Last Name" name="lastName" isRequired defaultValue={employee?.last_name}></TextField>

            <TextField label="Employee ID"
                       name="employeeId"
                       isRequired isReadOnly={!!employee} // lock in edit mode
                       defaultValue={employee?.employee_id}/>

            <TextField label="Office Number" name="officeNumber" isRequired />

            <TextArea label="Notes" name="notes" defaultValue={employee?.notes ?? undefined}></TextArea>

            {/*<div style={{backgroundColor: "gray"}}>*/}
            <ButtonGroup>
                <Button type="submit">{employee ? "Save" : "Create"}</Button>
                <Button variant="secondary"
                        onPress={onCancel}>Cancel</Button>
            </ButtonGroup>
            {/*</div>*/}

            {/* Only render the delete button in the edit modal */}
            {employee ? (
                <ButtonGroup alignment="end">
                    <Button variant="secondary"
                            danger
                        onPress={onDelete}
                    >Delete</Button>
                </ButtonGroup>
            ): null}
        </Form>
    )
}
