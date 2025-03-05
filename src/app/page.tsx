"use client";


import {Search} from "@/components/Search/Search";
import {EditModal} from "@/components/EditModal";
import {DeleteAlertDialog} from "@/components/DeleteAlertDialog";
import {ModalDialog} from "@/components/ModalDialog";
import {EmployeeForm} from "@/components/Entity_Forms/EmployeeForm";

import {useEntityActions} from "@/hooks/useEntityActions";

import {
    Footer,
    Header,
    InlineAlert,
} from "@bcgov/design-system-react-components"


export default function Home() {

    const {
        searchResults,
        selectedSearchResult,
        selectedFilterTags,
        setSelectedFilterTags,
        alert,
        setAlert,
        isSelectedSearchResultEditModalOpen,
        setIsSelectedSearchResultEditModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        setIsAddNewEmployeeModalOpen,
        openSearchResultEditModal,
        userHasSearchedOnce,
        handleSearch,
        handleEdit,
        handleDelete,
        handleAddNewEmployee,
    } = useEntityActions()

    return (
        <>
            <Header title="Employee Information"></Header>

            <Search
                searchResults={searchResults}
                selectedFilterTags={selectedFilterTags}
                setSelectedFilterTags={setSelectedFilterTags}
                userHasSearchedOnce={userHasSearchedOnce}
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
