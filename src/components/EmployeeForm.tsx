import {Button, ButtonGroup, Form, TextField} from "@bcgov/design-system-react-components";
import {Employee} from "@/types/Employee";

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
                  display: "flex",
                  flexDirection: "column",
                  gap: '0.5rem',
              }}>
            <TextField label="First Name"
                       name="firstName"
                       isRequired
                       defaultValue={employee?.first_name}/>
            <TextField label="Employee ID"
                       name="employeeId"
                       isRequired isDisabled={!!employee} // disable in edit mode
                       defaultValue={employee?.employee_id}/>
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