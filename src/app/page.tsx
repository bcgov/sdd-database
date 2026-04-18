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

import {EmployeeForm} from "@/components/Entity_Forms/Employee/EmployeeForm";

import {useEntityOrchestration} from "@/hooks/useEntityOrchestration";


export default function Home() {

    const {uiState, alerts, search, actions, editHandlers} = useEntityOrchestration()

    return (
        <>
            <Header title="Employee Information"></Header>

            <Search
                selectedFilterTags={search.selectedFilterTags}
                setSelectedFilterTags={search.setSelectedFilterTags}
                handleSearch={search.handleSearch}
                userHasSearchedOnce={search.userHasSearchedOnce}
                searchResultsAreEmpty={search.searchResultsAreEmpty}
                visibleSearchResults={search.optimisticSearchResults}
                searchResultClickHandler={actions.openSearchResultEditModal}
                assignMode={search.assignMode}
                cancelAssignModeHandler={actions.cancelAssignModeHandler}
                assignOfficeClickHandler={actions.assignOfficeClickHandler}
                assignWorkspaceClickHandler={actions.assignWorkspaceClickHandler}>
            </Search>

            {actions.selectedSearchResult &&
                <>
                    <EditModal
                        item={actions.selectedSearchResult}
                        activateAssignMode={actions.activateAssignMode}
                        handleRemoveWorkspace={actions.removeWorkspaceClickHandler}
                        handleHoldWorkspace={actions.holdWorkspaceClickHandler}
                        handleRemoveWorkspaceHold={actions.removeHoldWorkspaceClickHandler}
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

            {/*Only show add new employee button outside assign mode*/}
            {search.assignMode === "none" &&
                    <ModalDialog isOpen={actions.isAddNewEmployeeModalOpen}
                                 setIsOpen={actions.openCloseAddNewEmployeeModal}
                                 triggerButtonText="Add New Employee"
                                 modalTitle="Add New Employee">
                        <EmployeeForm employee={actions.draftNewEmployee}
                                      activateAssignMode={actions.activateAssignMode}
                                      handleRemoveWorkspace={actions.removeWorkspaceClickHandler}
                                      onSuccess={actions.onAddNewEmployeeSuccess}
                                      onError={actions.onAddNewEmployeeError}
                                      onClose={() => actions.openCloseAddNewEmployeeModal(false)}>
                        </EmployeeForm>
                    </ModalDialog>
            }

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
