"use client";

import {
    Button,
    ButtonGroup,
    Dialog,
    DialogTrigger,
    Footer,
    Form,
    Header,
    Modal,
    TextField
} from "@bcgov/design-system-react-components"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import {createNewEmployee} from "@/app/action";

export default function Home() {

    const search = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const searchPhrase = formData.get("search") as string;

        console.log("Search pressed with text = ", searchPhrase);
    }

    return (
        <div>
            <Header title="Employee Information"></Header>
            <Form onSubmit={search}>
                <TextField type="search" name="search" iconLeft=<SearchOutlinedIcon/>/>
                <Button type="submit">Search</Button>
            </Form>

            <DialogTrigger>
                <Button variant="secondary">Add New Employee</Button>
                <Modal>
                    <Dialog>
                        Add New Employee
                        <Form action={createNewEmployee}>
                            <TextField label="First Name" name="firstName" isRequired/>
                            <TextField label="Employee ID" name="employeeId" isRequired/>
                            <ButtonGroup>
                                <Button type="submit">Create</Button>
                            </ButtonGroup>
                        </Form>
                    </Dialog>
                </Modal>
            </DialogTrigger>
            <Footer hideAcknowledgement hideLogoAndLinks></Footer>
        </div>
    );
}
