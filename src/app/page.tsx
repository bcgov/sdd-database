"use client";

import {Button, ButtonGroup, Dialog, DialogTrigger, Form, Modal, TextField} from "@bcgov/design-system-react-components"

export default function Home() {

    return (
        <div>
            <DialogTrigger>
                <Button variant="secondary">Add New Employee</Button>
                <Modal>
                    <Dialog>
                        Add New Employee
                        <Form >
                            <TextField label="First Name" isRequired/>
                            <TextField label="Employee ID" isRequired/>
                            <ButtonGroup>
                                <Button>Create</Button>
                            </ButtonGroup>
                        </Form>
                    </Dialog>
                </Modal>
            </DialogTrigger>
        </div>
    );
}
