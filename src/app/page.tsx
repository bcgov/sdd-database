"use client";

import {
    Button,
    ButtonGroup,
    Dialog,
    DialogTrigger,
    Footer,
    Form,
    Header,
    InlineAlert,
    Modal,
    TextField
} from "@bcgov/design-system-react-components"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import {addNewEmployee, searchEmployees} from "@/actions/employees";
import {useState} from "react";

interface Employee {
    employee_id: string;
    first_name: string;
}

interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export default function Home() {

    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<Employee[]>([]);

    const [alert, setAlert] = useState<Alert | undefined>();

    const handleAddNewEmployee = async (formData: FormData) => {

        const firstName = formData.get("firstName") as string;
        const employeeId = formData.get("employeeId") as string;

        const result = await addNewEmployee(firstName, employeeId);

        if (result.success) {

            setAlert({
                variant: "success",
                title: "Success",
                description: `New employee '${firstName}' added!`
            })

            // Auto-hide the success alert message after 4.5 seconds
            setTimeout(() => {
                setAlert(undefined);
            }, 4500)
        } else {

            setAlert({
                variant: "danger",
                title: `Error: Could not add new employee '${firstName}'`,
                description: result.error ?? "An unexpected error occurred."
            })
        }
    }

    const handleSearch = async (formData: FormData) => {

        const searchPhrase = formData.get("search") as string;

        const searchResults = await searchEmployees(searchPhrase);
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

            {alert && <InlineAlert title={alert.title}
                                   description={alert.description}
                                   isCloseable
                                   onClose={() => setAlert(undefined)}
                                   variant={alert.variant}></InlineAlert>}

            <Footer hideAcknowledgement hideLogoAndLinks></Footer>
        </div>
    );
}
