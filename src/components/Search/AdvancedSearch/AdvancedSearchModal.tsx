import { useState } from "react";
import {
  Button,
  ButtonGroup,
  InlineAlert,
} from "@bcgov/design-system-react-components";

import type { EntityType } from "@/types";
import { hasAdvancedSearchCriteria } from "@/domain/advancedSearch";
import type { EmployeeAdvancedSearchState } from "@/hooks/search/useEmployeeAdvancedSearchState";
import type { OfficeAdvancedSearchState } from "@/hooks/search/useOfficeAdvancedSearchState";
import type { WorkspaceAdvancedSearchState } from "@/hooks/search/useWorkspaceAdvancedSearchState";
import type { WorkstationAdvancedSearchState } from "@/hooks/search/useWorkstationAdvancedSearchState";
import type { MobileDeviceAdvancedSearchState } from "@/hooks/search/useMobileDeviceAdvancedSearchState";
import type { MobilePlanAdvancedSearchState } from "@/hooks/search/useMobilePlanAdvancedSearchState";
import { ModalDialog } from "@/components/ModalDialog";
import { ModalContentLayout } from "@/components/ModalContentLayout";
import { EmployeeAdvancedSearchFields } from "@/components/Search/AdvancedSearch/EmployeeAdvancedSearchFields";
import { OfficeAdvancedSearchFields } from "@/components/Search/AdvancedSearch/OfficeAdvancedSearchFields";
import { WorkspaceAdvancedSearchFields } from "@/components/Search/AdvancedSearch/WorkspaceAdvancedSearchFields";
import { WorkstationAdvancedSearchFields } from "@/components/Search/AdvancedSearch/WorkstationAdvancedSearchFields";
import { MobileDeviceAdvancedSearchFields } from "@/components/Search/AdvancedSearch/MobileDeviceAdvancedSearchFields";
import { MobilePlanAdvancedSearchFields } from "@/components/Search/AdvancedSearch/MobilePlanAdvancedSearchFields";
import { advancedSearchTabs } from "@/components/Search/AdvancedSearch/advancedSearchTabs";

interface AdvancedSearchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchPhrase: string;
  employeeAdvancedSearch: EmployeeAdvancedSearchState;
  officeAdvancedSearch: OfficeAdvancedSearchState;
  workspaceAdvancedSearch: WorkspaceAdvancedSearchState;
  workstationAdvancedSearch: WorkstationAdvancedSearchState;
  mobileDeviceAdvancedSearch: MobileDeviceAdvancedSearchState;
  mobilePlanAdvancedSearch: MobilePlanAdvancedSearchState;
  onSearch: (entityType: EntityType) => Promise<void>;
}

export function AdvancedSearchModal({
  isOpen,
  setIsOpen,
  searchPhrase,
  employeeAdvancedSearch,
  officeAdvancedSearch,
  workspaceAdvancedSearch,
  workstationAdvancedSearch,
  mobileDeviceAdvancedSearch,
  mobilePlanAdvancedSearch,
  onSearch,
}: AdvancedSearchModalProps) {
  const [activeEntityType, setActiveEntityType] =
    useState<EntityType>("employee");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const canSearch =
    activeEntityType === "employee"
      ? hasAdvancedSearchCriteria(searchPhrase, employeeAdvancedSearch.filters)
      : activeEntityType === "office"
        ? hasAdvancedSearchCriteria(searchPhrase, officeAdvancedSearch.filters)
        : activeEntityType === "workspace"
          ? hasAdvancedSearchCriteria(
              searchPhrase,
              workspaceAdvancedSearch.filters,
            )
          : activeEntityType === "workstation"
            ? hasAdvancedSearchCriteria(
                searchPhrase,
                workstationAdvancedSearch.filters,
              )
            : activeEntityType === "mobileDevice"
              ? hasAdvancedSearchCriteria(
                  searchPhrase,
                  mobileDeviceAdvancedSearch.filters,
                )
              : hasAdvancedSearchCriteria(
                  searchPhrase,
                  mobilePlanAdvancedSearch.filters,
                );

  const clearActiveFilters = () => {
    switch (activeEntityType) {
      case "employee":
        employeeAdvancedSearch.clearFilters();
        break;
      case "office":
        officeAdvancedSearch.clearFilters();
        break;
      case "workspace":
        workspaceAdvancedSearch.clearFilters();
        break;
      case "workstation":
        workstationAdvancedSearch.clearFilters();
        break;
      case "mobileDevice":
        mobileDeviceAdvancedSearch.clearFilters();
        break;
      case "mobilePlan":
        mobilePlanAdvancedSearch.clearFilters();
        break;
    }

    setErrorMessage(undefined);
  };

  const handleSearch = async () => {
    setErrorMessage(undefined);
    setIsPending(true);

    try {
      await onSearch(activeEntityType);
      setIsOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to run the advanced search.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modalTitle="Advanced Search"
    >
      <div
        style={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          maxWidth: "100%",
          minHeight: 0,
          minWidth: 0,
          width: "100%",
        }}
      >
        <div
          aria-label="Entity type"
          role="tablist"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          {advancedSearchTabs.map((tab) => {
            const isSelected = activeEntityType === tab.entityType;

            return (
              <button
                key={tab.entityType}
                type="button"
                id={`advanced-search-tab-${tab.entityType}`}
                role="tab"
                aria-controls={`advanced-search-panel-${tab.entityType}`}
                aria-selected={isSelected}
                disabled={tab.isDisabled}
                onClick={() => setActiveEntityType(tab.entityType)}
                style={{
                  backgroundColor: isSelected ? "#003366" : "white",
                  border: isSelected
                    ? "1px solid #003366"
                    : "1px solid #255a90",
                  borderRadius: "4px",
                  color: isSelected ? "white" : "#255a90",
                  cursor: tab.isDisabled ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  minHeight: "2.25rem",
                  opacity: tab.isDisabled ? 0.55 : 1,
                  padding: "0.5rem 0.75rem",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <ModalContentLayout
          footer={
            <ButtonGroup alignment="end">
              <Button
                type="button"
                variant="secondary"
                isDisabled={isPending}
                onPress={clearActiveFilters}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="secondary"
                isDisabled={isPending}
                onPress={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                isDisabled={!canSearch || isPending}
                onPress={handleSearch}
              >
                {isPending ? "Searching..." : "Search"}
              </Button>
            </ButtonGroup>
          }
        >
          <div
            id={`advanced-search-panel-${activeEntityType}`}
            aria-labelledby={`advanced-search-tab-${activeEntityType}`}
            role="tabpanel"
            style={{ marginBottom: "1rem", paddingTop: "1rem" }}
          >
            {errorMessage ? (
              <div style={{ marginBottom: "1rem" }}>
                <InlineAlert
                  title="Unable to search"
                  description={errorMessage}
                  variant="danger"
                />
              </div>
            ) : null}

            {activeEntityType === "employee" ? (
              <EmployeeAdvancedSearchFields state={employeeAdvancedSearch} />
            ) : activeEntityType === "office" ? (
              <OfficeAdvancedSearchFields state={officeAdvancedSearch} />
            ) : activeEntityType === "workspace" ? (
              <WorkspaceAdvancedSearchFields state={workspaceAdvancedSearch} />
            ) : activeEntityType === "workstation" ? (
              <WorkstationAdvancedSearchFields
                state={workstationAdvancedSearch}
              />
            ) : activeEntityType === "mobileDevice" ? (
              <MobileDeviceAdvancedSearchFields
                state={mobileDeviceAdvancedSearch}
              />
            ) : (
              <MobilePlanAdvancedSearchFields
                state={mobilePlanAdvancedSearch}
              />
            )}
          </div>
        </ModalContentLayout>
      </div>
    </ModalDialog>
  );
}
