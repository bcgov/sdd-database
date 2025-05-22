"use client";

import {
    Footer,
    Header,
    InlineAlert,
} from "@bcgov/design-system-react-components"

import {Search} from "@/components/Search/Search";
import {EditModal} from "@/components/EditModal";
import {DeleteAlertDialog} from "@/components/DeleteAlertDialog";
import {ModalDialog} from "@/components/ModalDialog";
import {EmployeeForm} from "@/components/Entity_Forms/EmployeeForm";
import {WorkstationForm} from "@/components/Entity_Forms/WorkstationForm";

import {useEntityActions} from "@/hooks/useEntityActions";


export default function Home() {

    const {
        searchResults,
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        draftNewEmployee,
        selectedSearchResult,
        alert,
        setAlert,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        isAddNewWorkstationModalOpen,
        setIsAddNewWorkstationModalOpen,
        openSearchResultEditModal,
        userHasSearchedOnce,
        handleSearch,
        handleEdit,
        handleDeleteEmployee,
        handleAddNewEmployee,
        openCloseAddNewEmployeeModal,
        handleAddNewWorkstation,
        activateAssignMode,
        assignOfficeClickHandler
    } = useEntityActions()

    return (
        <>
            <Header title="Employee Information"></Header>

            <Search
                searchResults={searchResults}
                selectedFilterTags={selectedFilterTags}
                setSelectedFilterTags={setSelectedFilterTags}
                handleSearch={handleSearch}
                userHasSearchedOnce={userHasSearchedOnce}
                searchResultClickHandler={openSearchResultEditModal}
                assignMode={assignMode}
                assignOfficeClickHandler={assignOfficeClickHandler}
            />

            {selectedSearchResult &&
                <>
                    <EditModal
                        item={selectedSearchResult}
                        activateAssignMode={activateAssignMode}
                        isOpen={isEditModalOpen}
                        setIsOpen={setIsEditModalOpen}
                        onSubmit={handleEdit}
                        onDelete={() => setIsDeleteAlertDialogOpen(true)}
                    />

                    {
                        selectedSearchResult.type === "employee" &&
                        <DeleteAlertDialog
                            employee={selectedSearchResult}
                            isOpen={isDeleteAlertDialogOpen}
                            setIsOpen={setIsDeleteAlertDialogOpen}
                            onDelete={handleDeleteEmployee}/>
                    }
                </>
            }

            <ModalDialog isOpen={isAddNewEmployeeModalOpen}
                         setIsOpen={openCloseAddNewEmployeeModal}
                         triggerButtonText="Add New Employee"
                         disableTriggerButton={assignMode}
                         modalTitle="Add New Employee">
                <EmployeeForm onSubmit={handleAddNewEmployee}
                              employee={draftNewEmployee}
                              activateAssignMode={activateAssignMode}
                              onClose={() => openCloseAddNewEmployeeModal(false)}/>
            </ModalDialog>

            <ModalDialog isOpen={isAddNewWorkstationModalOpen}
                         setIsOpen={setIsAddNewWorkstationModalOpen}
                         triggerButtonText="Add New Workstation"
                         modalTitle="Add New Workstation">
                <WorkstationForm onSubmit={handleAddNewWorkstation}
                                 onClose={() => setIsAddNewWorkstationModalOpen(false)}/>
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
