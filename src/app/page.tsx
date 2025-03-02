"use client";


import {Search} from "@/components/Search";
import {EditModal} from "@/components/EditModal";
import {DeleteAlertDialog} from "@/components/DeleteAlertDialog";
import {ModalDialog} from "@/components/ModalDialog";
import {EmployeeForm} from "@/components/EmployeeForm";

import {useEntityActions} from "@/hooks/useEntityActions";

import {
    Footer,
    Header,
    InlineAlert,
} from "@bcgov/design-system-react-components"


export default function Home() {

    const {
        searchPhrase,
        searchResults,
        selectedSearchResult,
        isSelectedSearchResultEditModalOpen,
        setIsSelectedSearchResultEditModalOpen,
        isAddNewEmployeeModalOpen,
        setIsAddNewEmployeeModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        handleSearch,
        openSearchResultEditModal,
        handleEdit,
        handleAddNewEmployee,
        handleDelete,
        alert,
        setAlert
    } = useEntityActions()

    return (
        <>
            <Header title="Employee Information"></Header>

            <Search
                searchPhrase={searchPhrase}
                searchResults={searchResults}
                searchResultClickHandler={openSearchResultEditModal}
                handleSearch={handleSearch}
            />

            {selectedSearchResult &&
                <>
                    <EditModal
                        item={selectedSearchResult}
                        isOpen={isSelectedSearchResultEditModalOpen}
                        setIsOpen={setIsSelectedSearchResultEditModalOpen}
                        onSubmit={handleEdit}
                        onDelete={() => setIsDeleteAlertDialogOpen(true)}
                    />

                    {selectedSearchResult.type === "employee" &&
                        <DeleteAlertDialog
                            employee={selectedSearchResult}
                            isOpen={isDeleteAlertDialogOpen}
                            setIsOpen={setIsDeleteAlertDialogOpen}
                            onDelete={handleDelete}/>
                    }
                </>
            }

            <ModalDialog isOpen={isAddNewEmployeeModalOpen}
                         setIsOpen={setIsAddNewEmployeeModalOpen}
                         triggerButtonText="Add New Employee"
                         modalTitle="Add New Employee">
                <EmployeeForm onSubmit={handleAddNewEmployee}
                              onCancel={() => setIsAddNewEmployeeModalOpen(false)}/>
            </ModalDialog>

            {alert && <InlineAlert title={alert.title}
                                   description={alert.description}
                                   isCloseable
                                   onClose={() => setAlert(undefined)}
                                   variant={alert.variant}></InlineAlert>}

            <Footer hideAcknowledgement hideLogoAndLinks></Footer>
        </>
    );
}
