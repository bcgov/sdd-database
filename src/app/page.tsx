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
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        selectedSearchResult,
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
        activateAssignMode
    } = useEntityActions()

    return (
        <>
            <Header title="Employee Information"></Header>

            <Search
                searchResults={searchResults}
                selectedFilterTags={selectedFilterTags}
                setSelectedFilterTags={setSelectedFilterTags}
                disableFilterTags={assignMode}
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
                         disableTriggerButton={assignMode}
                         modalTitle="Add New Employee">
                <EmployeeForm onSubmit={handleAddNewEmployee}
                              activateAssignMode={activateAssignMode}
                              onClose={() => setIsAddNewEmployeeModalOpen(false)}/>
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
