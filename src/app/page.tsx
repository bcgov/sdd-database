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
import {addNewEmployee, searchEmployees} from "@/actions/employees";
import {useState} from "react";

type Employee = {
    employee_id: string;
    first_name: string;
}

export default function Home() {

    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<Employee[]>([]);

    const handleAddNewEmployee = async (formData: FormData) => {

        const firstName = formData.get("firstName") as string;
        const employeeId = formData.get("employeeId") as string;

        await addNewEmployee(firstName, employeeId);
    }

    const handleSearch = async (formData: FormData) => {

        const searchPhrase = formData.get("search") as string;

        const searchResults = await searchEmployees(searchPhrase);
        console.log(searchResults);
        setSearchResults(searchResults);
        setHasSearched(true);
    }

    return (
        <div>
            <Header title="Employee Information"></Header>
            <Form action={handleSearch}>
                <TextField type="search" name="search" iconLeft=<SearchOutlinedIcon/>/>
                <Button type="submit">Search</Button>
            </Form>
            {hasSearched && searchResults.length === 0 ? (
                <p> No Employees found</p>
            ) : (
                <ul>
                    {searchResults.map(employee => (
                        <li key={employee.employee_id}>
                            <strong>{employee.first_name}</strong> (Employee ID: {employee.employee_id})
                        </li>
                    ))}
                </ul>
            )}

            <DialogTrigger>
                <Button variant="secondary">Add New Employee</Button>
                <Modal>
                    <Dialog>
                        Add New Employee
                        <Form action={handleAddNewEmployee}>
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
