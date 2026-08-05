import {
  Heading,
  NumberField,
  Select,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";

import type { WorkspaceAdvancedSearchState } from "@/hooks/search/useWorkspaceAdvancedSearchState";
import {
  advancedSearchSectionGridStyle,
  advancedSearchSectionStyle,
} from "@/components/Search/AdvancedSearch/advancedSearchLayout";

interface WorkspaceAdvancedSearchFieldsProps {
  state: WorkspaceAdvancedSearchState;
}

const workspaceStatusOptions = [
  { id: "available", label: "Available" },
  { id: "onHold", label: "On hold" },
  { id: "occupied", label: "Occupied" },
];

export function WorkspaceAdvancedSearchFields({
  state,
}: WorkspaceAdvancedSearchFieldsProps) {
  const {
    filters,
    categories,
    deskTypes,
    branches,
    programAreas,
    updateFilter,
    setRestrictedBranchId,
    setRestrictedProgramAreaId,
  } = state;

  const restrictionProgramAreaOptions = [
    { id: "unrestricted", label: "Unrestricted" },
    ...programAreas.map((programArea) => ({
      id: programArea.id,
      label: programArea.name,
    })),
  ];

  return (
    <>
      <section aria-labelledby="advanced-search-workspace-details-heading">
        <Heading id="advanced-search-workspace-details-heading" level={5}>
          Workspace Details
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Office Number"
            value={filters.officeNumber ?? ""}
            onChange={(value) => updateFilter("officeNumber", value)}
          />
          <TextField
            label="Workspace Number"
            value={filters.workspaceNumber ?? ""}
            onChange={(value) => updateFilter("workspaceNumber", value)}
          />
          <TextField
            label="Position Number"
            value={filters.positionNumber ?? ""}
            onChange={(value) => updateFilter("positionNumber", value)}
          />
          <NumberField
            label="Office Floor"
            minValue={0}
            value={filters.officeFloor}
            onChange={(value) =>
              updateFilter("officeFloor", value === null ? undefined : value)
            }
          />
          <Select
            label="Category"
            items={categories.map((category) => ({
              id: category.id,
              label: category.name,
            }))}
            value={filters.categoryId ?? null}
            onChange={(value) =>
              updateFilter(
                "categoryId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any category"
          />
          <Select
            label="Desk Type"
            items={deskTypes.map((deskType) => ({
              id: deskType.id,
              label: deskType.name,
            }))}
            value={filters.deskTypeId ?? null}
            onChange={(value) =>
              updateFilter(
                "deskTypeId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any desk type"
          />
          <Select
            label="Status"
            items={workspaceStatusOptions}
            value={filters.status ?? null}
            onChange={(value) => {
              if (
                value === "available" ||
                value === "onHold" ||
                value === "occupied"
              ) {
                updateFilter("status", value);
              } else {
                updateFilter("status", undefined);
              }
            }}
            placeholder="Any status"
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <TextArea
            label="Notes"
            value={filters.notes ?? ""}
            onChange={(value) => updateFilter("notes", value)}
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-workspace-restrictions-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-workspace-restrictions-heading" level={5}>
          Workspace Restrictions
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <Select
            label="Restricted Branch"
            items={branches.map((branch) => ({
              id: branch.id,
              label: branch.name,
            }))}
            value={filters.restrictedBranchId ?? null}
            onChange={(value) =>
              setRestrictedBranchId(value === null ? undefined : Number(value))
            }
            placeholder="Any restricted branch"
          />
          <Select
            label="Restricted Program Area"
            items={restrictionProgramAreaOptions}
            value={
              filters.restrictedProgramAreaId === null
                ? "unrestricted"
                : (filters.restrictedProgramAreaId ?? null)
            }
            onChange={(value) => {
              if (value === "unrestricted") {
                setRestrictedProgramAreaId(null);
              } else {
                setRestrictedProgramAreaId(
                  value === null ? undefined : Number(value),
                );
              }
            }}
            placeholder="Any restriction"
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-workspace-assignment-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-workspace-assignment-heading" level={5}>
          Assignment
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
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
