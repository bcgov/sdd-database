"use client";

import {
    Button,
    ButtonGroup,
    Dialog,
    DialogTrigger,
    Footer,
    Form,
    Header,
    Heading,
    InlineAlert,
    Modal,
    TextField
} from "@bcgov/design-system-react-components"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import {addNewEmployee, searchEmployees} from "@/actions/employees";
import {useState} from "react";
import {SearchResult} from "@/components/SearchResult";
import {Employee} from "@/types/Employee";

interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export default function Home() {

    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<Employee[]>([]);

    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);
    const [alert, setAlert] = useState<Alert | undefined>();

    const handleAddNewEmployee = async (formData: FormData) => {

        const first_name = formData.get("firstName") as string;
        const employee_id = formData.get("employeeId") as string;

        const newEmployee: Employee = {
            first_name,
            employee_id,
        }

        const result = await addNewEmployee(newEmployee);

        setIsAddNewEmployeeModalOpen(false);

        if (result.success) {

            setAlert({
                variant: "success",
                title: "Success",
                description: `New employee '${first_name}' added!`
            })

            // Auto-hide the success alert message after 4.5 seconds
            setTimeout(() => {
                setAlert(undefined);
            }, 4500)
        } else {

            setAlert({
                variant: "danger",
                title: `Error: Could not add new employee '${first_name}'`,
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
                searchResults.map(employee => (
                    <SearchResult key={employee.employee_id} employee={employee}/>
                ))
            )}

            <DialogTrigger isOpen={isAddNewEmployeeModalOpen} onOpenChange={setIsAddNewEmployeeModalOpen}>
                <Button variant="secondary">Add New Employee</Button>
                <Modal>
                    <Dialog>
                        <div style={{padding: "1rem"}}>
                            <Heading level={5}>Add New Employee</Heading>
                            <Form action={handleAddNewEmployee}
                                  style={{display: "flex", flexDirection: "column", gap: '0.5rem',}}>
                                <TextField label="First Name" name="firstName" isRequired/>
                                <TextField label="Employee ID" name="employeeId" isRequired/>
                                <ButtonGroup>
                                    <Button type="submit">Create</Button>
                                    <Button variant="secondary"
                                            onPress={() => setIsAddNewEmployeeModalOpen(false)}>Cancel</Button>
                                </ButtonGroup>
                            </Form>
                        </div>
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
