"use client";

import {Button, ButtonGroup, Dialog, DialogTrigger, Form, Modal, TextField} from "@bcgov/design-system-react-components"

export default function Home() {

    const createNewEmployee = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const firstName = formData.get("firstName") as string;
        const employeeId = formData.get("employeeId") as string;

        console.log("Form Submitted");
        console.log({firstName, employeeId});
    }

    return (
        <div>
            <DialogTrigger>
                <Button variant="secondary">Add New Employee</Button>
                <Modal>
                    <Dialog>
                        Add New Employee
                        <Form onSubmit={createNewEmployee}>
                            <TextField label="First Name" name="firstName" isRequired/>
                            <TextField label="Employee ID" name="employeeId" isRequired/>
                            <ButtonGroup>
                                <Button type="submit">Create</Button>
                            </ButtonGroup>
                        </Form>
                    </Dialog>
                </Modal>
            </DialogTrigger>
        </div>
    );
}
