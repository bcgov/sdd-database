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

import {useEntityOrchestration} from "@/hooks/useEntityOrchestration";


export default function Home() {

    const {uiState, alerts, search, actions, editHandlers} = useEntityOrchestration()

    // dynamic title based on environment
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV
    const title = appEnv === "Production" ? "Employee Information" : `Employee Information (${appEnv})`

    return (
        <>
            <Header title={title}></Header>

            <Search
                selectedFilterTags={search.selectedFilterTags}
                setSelectedFilterTags={search.setSelectedFilterTags}
                handleSearch={search.handleSearch}
                userHasSearchedOnce={search.userHasSearchedOnce}
                searchResultsAreEmpty={search.searchResultsAreEmpty}
                visibleSearchResults={search.optimisticSearchResults}
                searchResultClickHandler={actions.openSearchResultEditModal}
                assignMode={search.assignMode}
                assignOfficeClickHandler={actions.assignOfficeClickHandler}>
            </Search>

            {actions.selectedSearchResult &&
                <>
                    <EditModal
                        item={actions.selectedSearchResult}
                        activateAssignMode={actions.activateAssignMode}
                        isOpen={uiState.isEditModalOpen}
                        setIsOpen={uiState.setIsEditModalOpen}
                        onSuccess={editHandlers.onEditSuccess}
                        onError={editHandlers.onEditError}
                        onDelete={() => actions.setIsDeleteAlertDialogOpen(true)}>
                    </EditModal>

                    {
                        actions.selectedSearchResult.type === "employee" &&
                        <DeleteAlertDialog
                            employee={actions.selectedSearchResult}
                            isOpen={actions.isDeleteAlertDialogOpen}
                            setIsOpen={actions.setIsDeleteAlertDialogOpen}
                            onDelete={actions.removeEmployeeById}>
                        </DeleteAlertDialog>
                    }
                </>
            }

            <ModalDialog isOpen={actions.isAddNewEmployeeModalOpen}
                         setIsOpen={actions.openCloseAddNewEmployeeModal}
                         triggerButtonText="Add New Employee"
                         disableTriggerButton={search.assignMode}
                         modalTitle="Add New Employee">
                <EmployeeForm employee={actions.draftNewEmployee}
                              activateAssignMode={actions.activateAssignMode}
                              onSuccess={actions.onAddNewEmployeeSuccess}
                              onError={actions.onAddNewEmployeeError}
                              onClose={() => actions.openCloseAddNewEmployeeModal(false)}>
                </EmployeeForm>
            </ModalDialog>

            <ModalDialog isOpen={actions.isAddNewWorkstationModalOpen}
                         setIsOpen={actions.setIsAddNewWorkstationModalOpen}
                         triggerButtonText="Add New Workstation"
                         modalTitle="Add New Workstation">
                <WorkstationForm onSuccess={actions.onAddNewWorkstationSuccess}
                                 onError={actions.onAddNewWorkstationError}
                                 onClose={() => actions.setIsAddNewWorkstationModalOpen(false)}>
                </WorkstationForm>
            </ModalDialog>

            {alerts.alert &&
                <InlineAlert title={alerts.alert.title}
                             description={alerts.alert.description}
                             isCloseable
                             onClose={() => alerts.setAlert(undefined)}
                             variant={alerts.alert.variant}>
                </InlineAlert>}

            <Footer hideAcknowledgement hideLogoAndLinks></Footer>
        </>
    );
}
