import {Button, ButtonGroup, Form, TextArea, TextField} from "@bcgov/design-system-react-components";
import {Employee} from "@prisma/client";


interface EmployeeFormProps {
    onSubmit: (formData: FormData) => void;
    employee?: Employee;    // Optional: Passed only in edit mode
    onCancel: () => void;
    submitButtonLabel: string;
}

export function EmployeeForm({onSubmit, employee, onCancel, submitButtonLabel}: EmployeeFormProps) {
    return (
        <Form action={onSubmit}
              style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // gap: '0.5rem',
              }}>
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
            <TextArea label="Notes" name="notes" defaultValue={employee?.notes ?? undefined}></TextArea>
            {/*<div style={{backgroundColor: "gray"}}>*/}
            <ButtonGroup>
                <Button type="submit">{submitButtonLabel}</Button>
                <Button variant="secondary"
                        onPress={onCancel}>Cancel</Button>
            </ButtonGroup>
            {/*</div>*/}
        </Form>
    )
}