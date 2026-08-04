import type { Selection } from "@react-types/shared";
import { AssignMode } from "@/types";
import {
  Button,
  Callout,
  Form,
  TextField,
} from "@bcgov/design-system-react-components";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FilterTags } from "@/components/Search/FilterTags";

interface SearchControlsProps {
  selectedFilterTags: Selection;
  setSelectedFilterTags: (selectedFilterTags: Selection) => void;
  handleSearch: (formData: FormData) => Promise<void>;
  assignMode: AssignMode;
}

export function SearchControls({
  selectedFilterTags,
  setSelectedFilterTags,
  handleSearch,
  assignMode,
}: SearchControlsProps) {
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
        style={{ margin: "1rem", display: "flex", gap: "1rem" }}
      >
        <TextField
          aria-label="Search"
          type="search"
          name="search"
          iconLeft={<SearchOutlinedIcon />}
        ></TextField>
        <Button
          type="submit"
          size="large"
          variant={assignMode !== "none" ? "secondary" : "primary"}
        >
          Search
        </Button>
      </Form>

      <FilterTags
        selectedFilterTags={selectedFilterTags}
        setSelectedFilterTags={setSelectedFilterTags}
        disableFilterTags={assignMode !== "none"}
      ></FilterTags>
    </>
  );
}
