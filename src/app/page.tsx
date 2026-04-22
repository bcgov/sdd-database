"use client";

import {
    Button,
    Header,
    InlineAlert,
} from "@bcgov/design-system-react-components"

import {EditModal} from "@/components/EditModal";
import {DeleteAlertDialog} from "@/components/DeleteAlertDialog";
import {ModalDialog} from "@/components/ModalDialog";

import {EmployeeForm} from "@/components/Entity_Forms/Employee/EmployeeForm";

import {useEntityOrchestration} from "@/hooks/useEntityOrchestration";
import {SearchControls} from "@/components/Search/SearchControls";
import {SearchResultsPanel} from "@/components/Search/SearchResultsPanel";

export default function Home() {
    const {uiState, alerts, search, actions, editHandlers} = useEntityOrchestration()

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header title="Employee Information"></Header>
            <SearchControls
                selectedFilterTags={search.selectedFilterTags}
                setSelectedFilterTags={search.setSelectedFilterTags}
                handleSearch={search.handleSearch}
                assignMode={search.assignMode}
            >
            </SearchControls>

            {alerts.alert &&
                <div style={{padding: "0 1rem 1rem 1rem"}}>
                    <InlineAlert
                        title={alerts.alert.title}
                        description={alerts.alert.description}
                        isCloseable
                        onClose={() => alerts.setAlert(undefined)}
                        variant={alerts.alert.variant}
                    >
                    </InlineAlert>
                </div>}

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                }}
            >
                <SearchResultsPanel
                    visibleSearchResults={search.optimisticSearchResults}
                    searchResultsAreEmpty={search.searchResultsAreEmpty}
                    userHasSearchedOnce={search.userHasSearchedOnce}
                    searchResultClickHandler={actions.openSearchResultEditModal}
                    assignMode={search.assignMode}
                    assignOfficeClickHandler={actions.assignOfficeClickHandler}
                    assignWorkspaceClickHandler={actions.assignWorkspaceClickHandler}
                    assignWorkstationClickHandler={actions.assignWorkstationClickHandler}
                >
                </SearchResultsPanel>
            </div>

            <div style={{padding: "1rem"}}>
                {search.assignMode !== "none" ? (
                    <Button
                        size="large"
                        variant="secondary"
                        onPress={actions.cancelAssignModeHandler}
                    >
                        Go Back
                    </Button>
                ) : (
                    <ModalDialog
                        isOpen={actions.isAddNewEmployeeModalOpen}
                        setIsOpen={actions.openCloseAddNewEmployeeModal}
                        triggerButtonText="Add New Employee"
                        modalTitle="Add New Employee"
                    >
                        <EmployeeForm
                            employee={actions.draftNewEmployee}
                            activateAssignMode={actions.activateAssignMode}
                            handleRemoveWorkspace={actions.removeWorkspaceClickHandler}
                            handleRemoveWorkstation={actions.removeWorkstationClickHandler}
                            onSuccess={actions.onAddNewEmployeeSuccess}
                            onError={actions.onAddNewEmployeeError}
                            onClose={() => actions.openCloseAddNewEmployeeModal(false)}
                        >
                        </EmployeeForm>
                    </ModalDialog>
                )}
            </div>

            {actions.selectedSearchResult &&
                <>
                    <EditModal
                        item={actions.selectedSearchResult}
                        activateAssignMode={actions.activateAssignMode}
                        handleRemoveWorkspace={actions.removeWorkspaceClickHandler}
                        handleRemoveWorkstation={actions.removeWorkstationClickHandler}
                        handleHoldWorkspace={actions.holdWorkspaceClickHandler}
                        handleRemoveWorkspaceHold={actions.removeHoldWorkspaceClickHandler}
                        isOpen={uiState.isEditModalOpen}
                        setIsOpen={uiState.setIsEditModalOpen}
                        onSuccess={editHandlers.onEditSuccess}
                        onError={editHandlers.onEditError}
                        onDelete={() => actions.setIsDeleteAlertDialogOpen(true)}
                    >
                    </EditModal>

                    {actions.selectedSearchResult.type === "employee" &&
                        <DeleteAlertDialog
                            employee={actions.selectedSearchResult}
                            isOpen={actions.isDeleteAlertDialogOpen}
                            setIsOpen={actions.setIsDeleteAlertDialogOpen}
                            onDelete={actions.removeEmployeeById}
                        >
                        </DeleteAlertDialog>
                    }
                </>
            }
        </div>
    );
}
