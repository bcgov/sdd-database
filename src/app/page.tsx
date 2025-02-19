"use client";

import {SearchResult} from "@/components/SearchResult";
import {EmployeeForm} from "@/components/EmployeeForm";
import {EmployeeModal} from "@/components/EmployeeModal";
import {EditEmployeeModal} from "@/components/EditEmployeeModal";

import {useEmployeeActions} from "@/hooks/useEmployeeActions";

import {
    AlertDialog,
    Button,
    DialogTrigger,
    Footer,
    Form,
    Header,
    InlineAlert,
    Modal,
    TextField
} from "@bcgov/design-system-react-components"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"

export default function Home() {

    const {
        searchPhrase,
        searchResults,
        selectedEmployeeSearchResult,
        isSelectedSearchResultEditModalOpen,
        setIsSelectedSearchResultEditModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        setIsAddNewEmployeeModalOpen,
        alert,
        setAlert,
        handleSearch,
        openSearchResultEditModal,
        handleEditEmployee,
        handleDelete,
        handleAddNewEmployee
    } = useEmployeeActions()

    return (
        <div>
            <Header title="Employee Information"></Header>

            <Form action={handleSearch}>
                <TextField type="search" name="search" iconLeft=<SearchOutlinedIcon/>/>
                <Button type="submit">Search</Button>
            </Form>

            {searchPhrase && searchResults.length === 0 ? (
                <p> No Employees found</p>
            ) : (
                searchResults.map(employee => (
                    <SearchResult key={employee.employee_id}
                                  employee={employee}
                                  searchResultClickHandler={openSearchResultEditModal}/>
                ))
            )}

            <EditEmployeeModal isOpen={isSelectedSearchResultEditModalOpen}
                               onOpenChange={setIsSelectedSearchResultEditModalOpen}
                               onSubmit={handleEditEmployee}
                               employee={selectedEmployeeSearchResult}
                               onDelete={() => setIsDeleteAlertDialogOpen(true)}/>

            <DialogTrigger isOpen={isDeleteAlertDialogOpen}
                           onOpenChange={setIsDeleteAlertDialogOpen}>
                <Modal>
                    <AlertDialog role="alertdialog" variant="destructive"
                                 title={`Are you sure you want to delete this employee '${selectedEmployeeSearchResult?.first_name}'?`}
                                 buttons={[
                                     <Button key="alert-dialog-button-1"
                                             danger onPress={() => handleDelete()}>Delete</Button>,
                                     <Button key="alert-dialog-button-2"
                                             variant="secondary"
                                             onPress={() => setIsDeleteAlertDialogOpen(false)
                                             }>Cancel</Button>
                                 ]}
                    />
                </Modal>
            </DialogTrigger>

            <EmployeeModal isOpen={isAddNewEmployeeModalOpen}
                           onOpenChange={setIsAddNewEmployeeModalOpen}
                           triggerButtonText="Add New Employee"
                           modalTitle="Add New Employee">
                <EmployeeForm onSubmit={handleAddNewEmployee}
                              onCancel={() => setIsAddNewEmployeeModalOpen(false)}
                              submitButtonLabel="Create"/>
            </EmployeeModal>

            {alert && <InlineAlert title={alert.title}
                                   description={alert.description}
                                   isCloseable
                                   onClose={() => setAlert(undefined)}
                                   variant={alert.variant}></InlineAlert>}

            <Footer hideAcknowledgement hideLogoAndLinks></Footer>
        </div>
    );
}
