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
import {addNewEmployeeAction, searchEmployeesAction, updateEmployeeAction} from "@/actions/employees";
import {useState} from "react";
import {SearchResult} from "@/components/SearchResult";
import {Employee} from "@/types/Employee";

interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export default function Home() {

    const [searchPhrase, setSearchPhrase] = useState("");
    const [searchResults, setSearchResults] = useState<Employee[]>([]);
    const [selectedEmployeeSearchResult, setSelectedEmployeeSearchResult] = useState<Employee>();

    const [isSelectedSearchResultEditModalOpen, setIsSelectedSearchResultEditModalOpen] = useState(false);
    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);

    const [alert, setAlert] = useState<Alert>();


    const handleSearch = async (formData: FormData) => {
        const query = formData.get("search") as string;
        setSearchPhrase(query);
        await runSearch(query);
    }

    const runSearch = async (query: string) => {
        const searchResults = await searchEmployeesAction(query);   // create local variable to avoid setState timing issue
        setSearchResults(searchResults);
    }

    const openSearchResultEditModal = (employee: Employee) => {
        setSelectedEmployeeSearchResult(employee);
        setIsSelectedSearchResultEditModalOpen(true);
    }

    const handleAddNewEmployee = async (formData: FormData) => {

        const first_name = formData.get("firstName") as string;
        const employee_id = formData.get("employeeId") as string;

        const newEmployee: Employee = {
            first_name,
            employee_id,
        }

        const result = await addNewEmployeeAction(newEmployee);

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

    const handleEditEmployee = async (formData: FormData) => {

        const first_name = formData.get("firstName") as string;

        const updatedEmployee: Employee = {
            first_name,
            employee_id: selectedEmployeeSearchResult!.employee_id  // using non-null assertion to let typescript
            // compiler know that this will never be undefined
        }

        await updateEmployeeAction(updatedEmployee);
        await runSearch(searchPhrase);

        setIsSelectedSearchResultEditModalOpen(false);

        setAlert({
            variant: "success",
            title: "Success",
            description: "Employee details updated!"
        })

        // Auto-hide the success alert message after 4.5 seconds
        setTimeout(() => {
            setAlert(undefined);
        }, 4500)
    }

    return (
        <div>
            <Header title="Employee Information"></Header>

            <Form action={handleSearch}>
                <TextField type="search" name="search" iconLeft=<SearchOutlinedIcon/>/>
                <Button type="submit">Search</Button>
            </Form>

            <DialogTrigger isOpen={isSelectedSearchResultEditModalOpen}
                           onOpenChange={setIsSelectedSearchResultEditModalOpen}>

                {searchPhrase && searchResults.length === 0 ? (
                    <p> No Employees found</p>
                ) : (
                    searchResults.map(employee => (
                        <SearchResult key={employee.employee_id}
                                      employee={employee}
                                      searchResultClickHandler={openSearchResultEditModal}/>
                    ))
                )}

                <Modal>
                    <Dialog>
                        <div style={{padding: "1rem"}}>
                            <Heading level={5}>Edit Employee</Heading>
                            <Form action={handleEditEmployee}
                                  style={{display: "flex", flexDirection: "column", gap: '0.5rem',}}>
                                <TextField label="First Name"
                                           name="firstName"
                                           isRequired
                                           defaultValue={selectedEmployeeSearchResult?.first_name}/>
                                <TextField label="Employee ID"
                                           name="employeeId"
                                           isRequired isDisabled
                                           defaultValue={selectedEmployeeSearchResult?.employee_id}/>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <ButtonGroup>
                                        <Button type="submit">Update</Button>
                                        <Button variant="secondary"
                                                onPress={() => setIsSelectedSearchResultEditModalOpen(false)}>Cancel</Button>
                                    </ButtonGroup>

                                    <ButtonGroup alignment="end">
                                        <Button variant="secondary" danger
                                                onPress={() => setIsSelectedSearchResultEditModalOpen(false)}>Delete</Button>
                                    </ButtonGroup>
                                </div>

                            </Form>
                        </div>
                    </Dialog>
                </Modal>

            </DialogTrigger>

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
