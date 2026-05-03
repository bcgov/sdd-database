"use client";

import {
    Button, ButtonGroup,
    Header,
    InlineAlert,
} from "@bcgov/design-system-react-components"

import {DeleteAlertDialog} from "@/components/DeleteAlertDialog";
import {ModalDialog} from "@/components/ModalDialog";

import {EmployeeForm} from "@/components/Entity_Forms/Employee/EmployeeForm";

import {SearchControls} from "@/components/Search/SearchControls";
import {SearchResultsPanel} from "@/components/Search/SearchResultsPanel";
import {EntityModal} from "@/components/Entity_Modals/EntityModal";
import {WorkstationForm} from "@/components/Entity_Forms/Workstation/WorkstationForm";
import {useEntityOrchestration} from "@/hooks/entity/useEntityOrchestration";

export default function Home() {
    const {
        selection,
        uiState,

        search,

        editHandlers,

        employeeEditor,
        employeeAssign,
        employeeCreateHandlers,
        employeeDelete,

        workspaceActions,

        workstationCreate,
        workstationCreateHandlers,

        alerts
    } = useEntityOrchestration()

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header title="Employee Information"></Header>

            <SearchControls selectedFilterTags={search.selectedFilterTags}
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
                    searchResultClickHandler={selection.openSearchResultEditModal}
                    assignMode={search.assignMode}
                    assignOfficeClickHandler={employeeAssign.assignOfficeClickHandler}
                    assignWorkspaceClickHandler={employeeAssign.assignWorkspaceClickHandler}
                    assignWorkstationClickHandler={employeeAssign.assignWorkstationClickHandler}
                >
                </SearchResultsPanel>
            </div>

            <div style={{padding: "1rem"}}>
                {search.assignMode !== "none" ? (
                    <Button size="large"
                            variant="secondary"
                            onPress={employeeAssign.cancelAssignModeHandler}
                    >
                        Go Back
                    </Button>
                ) : (
                    <ButtonGroup>
                        <ModalDialog isOpen={employeeEditor.isAddNewEmployeeModalOpen}
                                     setIsOpen={employeeEditor.openCloseAddNewEmployeeModal}
                                     triggerButtonText="Add New Employee"
                                     modalTitle="Add New Employee"
                        >
                            <EmployeeForm employee={employeeEditor.draftNewEmployee}
                                          activateAssignMode={employeeAssign.activateAssignMode}
                                          handleRemoveWorkspace={employeeAssign.removeWorkspaceClickHandler}
                                          handleRemoveWorkstation={employeeAssign.removeWorkstationClickHandler}
                                          onSuccess={employeeCreateHandlers.onAddNewEmployeeSuccess}
                                          onError={employeeCreateHandlers.onAddNewEmployeeError}
                                          onClose={() => employeeEditor.openCloseAddNewEmployeeModal(false)}
                            >
                            </EmployeeForm>
                        </ModalDialog>

                        <ModalDialog isOpen={workstationCreate.isAddNewWorkstationModalOpen}
                                     setIsOpen={workstationCreate.openCloseAddNewWorkstationModal}
                                     triggerButtonText="Add New Workstation"
                                     modalTitle="Add New Workstation"
                        >
                            <WorkstationForm onSuccess={workstationCreateHandlers.onAddNewWorkstationSuccess}
                                                   onError={workstationCreateHandlers.onAddNewWorkstationError}
                                                   onClose={() => workstationCreate.openCloseAddNewWorkstationModal(false)}>
                            </WorkstationForm>
                        </ModalDialog>
                    </ButtonGroup>
                )}
            </div>

            {selection.viewedEntity &&
                <>
                    <EntityModal
                        viewedEntity={selection.viewedEntity}
                        draftEditEmployee={employeeEditor.draftEditEmployee}

                        activateAssignMode={employeeAssign.activateAssignMode}

                        handleRemoveWorkspace={employeeAssign.removeWorkspaceClickHandler}
                        handleRemoveWorkstation={employeeAssign.removeWorkstationClickHandler}

                        handleHoldWorkspace={workspaceActions.holdWorkspaceClickHandler}
                        handleRemoveWorkspaceHold={workspaceActions.removeHoldWorkspaceClickHandler}

                        isOpen={uiState.isEditModalOpen}
                        setIsOpen={uiState.setIsEditModalOpen}

                        onSuccess={editHandlers.onEditSuccess}
                        onError={editHandlers.onEditError}
                        onDelete={() => employeeDelete.setIsDeleteAlertDialogOpen(true)}
                    >
                    </EntityModal>

                    {selection.viewedEntity.type === "employee" &&
                        <DeleteAlertDialog
                            employee={selection.viewedEntity}
                            isOpen={employeeDelete.isDeleteAlertDialogOpen}
                            setIsOpen={employeeDelete.setIsDeleteAlertDialogOpen}
                            onDelete={employeeDelete.removeEmployeeById}
                        >
                        </DeleteAlertDialog>
                    }
                </>
            }
        </div>
    );
}
