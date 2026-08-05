import type { Selection } from "@react-types/shared";
import type { AssignMode, EntityType } from "@/types";
import {
  Button,
  Callout,
  Form,
  TextField,
} from "@bcgov/design-system-react-components";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { FilterTags } from "@/components/Search/FilterTags";
import { useState } from "react";
import type { EmployeeAdvancedSearchState } from "@/hooks/search/useEmployeeAdvancedSearchState";
import type { OfficeAdvancedSearchState } from "@/hooks/search/useOfficeAdvancedSearchState";
import type { WorkspaceAdvancedSearchState } from "@/hooks/search/useWorkspaceAdvancedSearchState";
import type { WorkstationAdvancedSearchState } from "@/hooks/search/useWorkstationAdvancedSearchState";
import type { MobileDeviceAdvancedSearchState } from "@/hooks/search/useMobileDeviceAdvancedSearchState";
import type { MobilePlanAdvancedSearchState } from "@/hooks/search/useMobilePlanAdvancedSearchState";
import { AdvancedSearchModal } from "@/components/Search/AdvancedSearch/AdvancedSearchModal";

interface SearchControlsProps {
  selectedFilterTags: Selection;
  setSelectedFilterTags: (selectedFilterTags: Selection) => void;
  handleSearch: (formData: FormData) => Promise<void>;
  assignMode: AssignMode;
  searchPhrase: string;
  setSearchPhrase: (searchPhrase: string) => void;
  employeeAdvancedSearch: EmployeeAdvancedSearchState;
  officeAdvancedSearch: OfficeAdvancedSearchState;
  workspaceAdvancedSearch: WorkspaceAdvancedSearchState;
  workstationAdvancedSearch: WorkstationAdvancedSearchState;
  mobileDeviceAdvancedSearch: MobileDeviceAdvancedSearchState;
  mobilePlanAdvancedSearch: MobilePlanAdvancedSearchState;
  runAdvancedSearch: (entityType: EntityType) => Promise<void>;
}

export function SearchControls({
  selectedFilterTags,
  setSelectedFilterTags,
  handleSearch,
  assignMode,
  searchPhrase,
  setSearchPhrase,
  employeeAdvancedSearch,
  officeAdvancedSearch,
  workspaceAdvancedSearch,
  workstationAdvancedSearch,
  mobileDeviceAdvancedSearch,
  mobilePlanAdvancedSearch,
  runAdvancedSearch,
}: SearchControlsProps) {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const getAssignModeCallout = () => {
    switch (assignMode) {
      case "office":
        return {
          title: "Available Offices",
          description:
            "Use the search box to find the employee's office, then click Assign next to the correct result",
        };
      case "workspace":
        return {
          title: "Eligible On-Hold Workspaces in Employee's Office",
          description:
            "Use the search box to find a workspace in the selected office, then click Assign next to the correct result",
        };
      case "workstation":
        return {
          title: "Available Workstations",
          description:
            "Use the search box to find a workstation, then click Assign next to the correct result",
        };
      case "mobileDevice":
        return {
          title: "Available Mobile Devices",
          description:
            "Use the search box to find a mobile device, then click Assign next to the correct result",
        };
      case "mobilePlan":
        return {
          title: "Available Mobile Plans",
          description:
            "Only active, unassigned mobile plans are shown. Use the search box to find a plan, then click Assign next to the correct result",
        };
      default:
        return null;
    }
  };

  const assignModeCallout = getAssignModeCallout();

  return (
    <>
      {assignModeCallout && (
        <div
          style={{
            margin: "1rem",
          }}
        >
          <Callout
            title={assignModeCallout.title}
            description={assignModeCallout.description}
          ></Callout>
        </div>
      )}

      <Form
        action={handleSearch}
        style={{
          alignItems: "end",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          margin: "1rem",
        }}
      >
        <TextField
          aria-label="Search"
          type="search"
          name="search"
          iconLeft={<SearchOutlinedIcon />}
          value={searchPhrase}
          onChange={setSearchPhrase}
        ></TextField>
        <Button
          type="submit"
          size="large"
          variant={assignMode !== "none" ? "secondary" : "primary"}
        >
          Search
        </Button>
        {assignMode === "none" ? (
          <Button
            type="button"
            size="large"
            variant="secondary"
            onPress={() => setIsAdvancedSearchOpen(true)}
          >
            <TuneIcon />
            Advanced Search
          </Button>
        ) : null}
      </Form>

      {assignMode === "none" ? (
        <AdvancedSearchModal
          isOpen={isAdvancedSearchOpen}
          setIsOpen={setIsAdvancedSearchOpen}
          searchPhrase={searchPhrase}
          employeeAdvancedSearch={employeeAdvancedSearch}
          officeAdvancedSearch={officeAdvancedSearch}
          workspaceAdvancedSearch={workspaceAdvancedSearch}
          workstationAdvancedSearch={workstationAdvancedSearch}
          mobileDeviceAdvancedSearch={mobileDeviceAdvancedSearch}
          mobilePlanAdvancedSearch={mobilePlanAdvancedSearch}
          onSearch={runAdvancedSearch}
        />
      ) : null}

      <FilterTags
        selectedFilterTags={selectedFilterTags}
        setSelectedFilterTags={setSelectedFilterTags}
        disableFilterTags={assignMode !== "none"}
      ></FilterTags>
    </>
  );
}
