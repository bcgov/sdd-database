"use client";

import {
  Button,
  ButtonGroup,
  Header,
  InlineAlert,
} from "@bcgov/design-system-react-components";

import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import { ModalDialog } from "@/components/ModalDialog";

import { EmployeeForm } from "@/components/EntityForms/Employee/EmployeeForm";

import { SearchControls } from "@/components/Search/SearchControls";
import { SearchResultsPanel } from "@/components/Search/SearchResultsPanel";
import { EntityModal } from "@/components/EntityModals/EntityModal";
import { WorkstationForm } from "@/components/EntityForms/Workstation/WorkstationForm";
import { useEntityOrchestration } from "@/hooks/entity/useEntityOrchestration";
import { MobileDeviceForm } from "@/components/EntityForms/MobileDevice/MobileDeviceForm";

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

    mobileDeviceCreate,
    mobileDeviceCreateHandlers,

    alerts,
  } = useEntityOrchestration();

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
      ></SearchControls>

      {alerts.alert && (
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <InlineAlert
            title={alerts.alert.title}
            description={alerts.alert.description}
            isCloseable
            onClose={() => alerts.setAlert(undefined)}
            variant={alerts.alert.variant}
          ></InlineAlert>
        </div>
      )}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        <div style={{ height: "100%", overflowY: "auto" }}>
          <SearchResultsPanel
            visibleSearchResults={search.optimisticSearchResults}
            searchResultsAreEmpty={search.searchResultsAreEmpty}
            userHasSearchedOnce={search.userHasSearchedOnce}
            searchResultClickHandler={selection.openSearchResultEntityModal}
            assignMode={search.assignMode}
            assignOfficeClickHandler={employeeAssign.assignOfficeClickHandler}
            assignWorkspaceClickHandler={
              employeeAssign.assignWorkspaceClickHandler
            }
            assignWorkstationClickHandler={
              employeeAssign.assignWorkstationClickHandler
            }
            assignMobileDeviceClickHandler={
              employeeAssign.assignMobileDeviceClickHandler
            }
          ></SearchResultsPanel>
        </div>

        {search.optimisticSearchResults.length > 0 && (
          <output
            aria-live="polite"
            style={{
              position: "absolute",
              right: "1rem",
              bottom: "1rem",
              padding: "0.5rem 0.75rem",
              backgroundColor: "white",
              border: "1px solid #c6c6c6",
              borderRadius: "4px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            {search.optimisticSearchResults.length}{" "}
            {search.optimisticSearchResults.length === 1 ? "result" : "results"}
          </output>
        )}
      </div>

      <div style={{ padding: "1rem" }}>
        {search.assignMode !== "none" ? (
          <Button
            size="large"
            variant="secondary"
            onPress={employeeAssign.cancelAssignModeHandler}
          >
            Go Back
          </Button>
        ) : (
          <ButtonGroup>
            <ModalDialog
              isOpen={employeeEditor.isAddNewEmployeeModalOpen}
              setIsOpen={employeeEditor.openCloseAddNewEmployeeModal}
              triggerButtonText="Add New Employee"
              modalTitle="Add New Employee"
            >
              <EmployeeForm
                employee={employeeEditor.draftNewEmployee}
                activateAssignMode={employeeAssign.activateAssignMode}
                handleRemoveWorkspace={
                  employeeAssign.removeWorkspaceClickHandler
                }
                handleRemoveWorkstation={
                  employeeAssign.removeWorkstationClickHandler
                }
                handleRemoveMobileDevice={
                  employeeAssign.removeMobileDeviceClickHandler
                }
                onSuccess={employeeCreateHandlers.onCreateSuccess}
                onError={employeeCreateHandlers.onCreateError}
                onClose={() =>
                  employeeEditor.openCloseAddNewEmployeeModal(false)
                }
              ></EmployeeForm>
            </ModalDialog>

            <ModalDialog
              isOpen={workstationCreate.isAddNewWorkstationModalOpen}
              setIsOpen={workstationCreate.openCloseAddNewWorkstationModal}
              triggerButtonText="Add New Workstation"
              modalTitle="Add New Workstation"
            >
              <WorkstationForm
                onSuccess={workstationCreateHandlers.onCreateSuccess}
                onError={workstationCreateHandlers.onCreateError}
                onClose={() =>
                  workstationCreate.openCloseAddNewWorkstationModal(false)
                }
              ></WorkstationForm>
            </ModalDialog>

            <ModalDialog
              isOpen={mobileDeviceCreate.isAddNewMobileDeviceModalOpen}
              setIsOpen={mobileDeviceCreate.openCloseAddNewMobileDeviceModal}
              triggerButtonText="Add New Mobile Device"
              modalTitle="Add New Mobile Device"
            >
              <MobileDeviceForm
                onSuccess={mobileDeviceCreateHandlers.onCreateSuccess}
                onError={mobileDeviceCreateHandlers.onCreateError}
                onClose={() =>
                  mobileDeviceCreate.openCloseAddNewMobileDeviceModal(false)
                }
              ></MobileDeviceForm>
            </ModalDialog>
          </ButtonGroup>
        )}
      </div>

      {selection.viewedEntity && (
        <>
          <EntityModal
            viewedEntity={selection.viewedEntity}
            draftEditEmployee={employeeEditor.draftEditEmployee}
            activateAssignMode={employeeAssign.activateAssignMode}
            handleRemoveWorkspace={employeeAssign.removeWorkspaceClickHandler}
            handleRemoveWorkstation={
              employeeAssign.removeWorkstationClickHandler
            }
            handleRemoveMobileDevice={
              employeeAssign.removeMobileDeviceClickHandler
            }
            handleHoldWorkspace={workspaceActions.holdWorkspaceClickHandler}
            handleRemoveWorkspaceHold={
              workspaceActions.removeHoldWorkspaceClickHandler
            }
            isOpen={uiState.isEntityModalOpen}
            setIsOpen={uiState.setIsEntityModalOpen}
            onSuccess={editHandlers.onEditSuccess}
            onError={editHandlers.onEditError}
            onDelete={() => employeeDelete.setIsDeleteAlertDialogOpen(true)}
          ></EntityModal>

          {selection.viewedEntity.type === "employee" && (
            <DeleteAlertDialog
              employee={selection.viewedEntity}
              isOpen={employeeDelete.isDeleteAlertDialogOpen}
              setIsOpen={employeeDelete.setIsDeleteAlertDialogOpen}
              onDelete={employeeDelete.removeEmployeeById}
            ></DeleteAlertDialog>
          )}
        </>
      )}
    </div>
  );
}
