import {
  Heading,
  Select,
  TextField,
} from "@bcgov/design-system-react-components";

import type { WorkstationAdvancedSearchState } from "@/hooks/search/useWorkstationAdvancedSearchState";
import {
  advancedSearchSectionGridStyle,
  advancedSearchSectionStyle,
} from "@/components/Search/AdvancedSearch/advancedSearchLayout";

interface WorkstationAdvancedSearchFieldsProps {
  state: WorkstationAdvancedSearchState;
}

const assignmentOptions = [
  { id: "any", label: "Any assignment state" },
  { id: "assigned", label: "Assigned" },
  { id: "unassigned", label: "Unassigned" },
];

export function WorkstationAdvancedSearchFields({
  state,
}: WorkstationAdvancedSearchFieldsProps) {
  const { filters, models, updateFilter } = state;

  return (
    <>
      <section aria-labelledby="advanced-search-workstation-details-heading">
        <Heading id="advanced-search-workstation-details-heading" level={5}>
          Workstation Details
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Asset Tag"
            value={filters.assetTag ?? ""}
            onChange={(value) => updateFilter("assetTag", value)}
          />
          <Select
            label="Model"
            items={models.map((model) => ({
              id: model.id,
              label: model.name,
            }))}
            value={filters.modelId ?? null}
            onChange={(value) =>
              updateFilter(
                "modelId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any model"
          />
          <TextField
            label="Office Number"
            value={filters.officeNumber ?? ""}
            onChange={(value) => updateFilter("officeNumber", value)}
          />
          <TextField
            label="Notes"
            value={filters.notes ?? ""}
            onChange={(value) => updateFilter("notes", value)}
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-workstation-assignment-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-workstation-assignment-heading" level={5}>
          Assignment
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <Select
            label="Assignment State"
            items={assignmentOptions}
            value={
              filters.isAssigned === undefined
                ? "any"
                : filters.isAssigned
                  ? "assigned"
                  : "unassigned"
            }
            onChange={(value) =>
              updateFilter(
                "isAssigned",
                value === "assigned"
                  ? true
                  : value === "unassigned"
                    ? false
                    : undefined,
              )
            }
          />
          <TextField
            label="Assigned Employee IDIR"
            value={filters.assignedEmployeeIdir ?? ""}
            onChange={(value) => updateFilter("assignedEmployeeIdir", value)}
          />
        </div>
      </section>
    </>
  );
}
