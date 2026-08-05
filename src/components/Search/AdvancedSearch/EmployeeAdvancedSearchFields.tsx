import {
  Checkbox,
  Heading,
  Select,
  TextField,
} from "@bcgov/design-system-react-components";

import type { EmployeeAdvancedSearchState } from "@/hooks/search/useEmployeeAdvancedSearchState";
import {
  advancedSearchSectionGridStyle,
  advancedSearchSectionStyle,
} from "@/components/Search/AdvancedSearch/advancedSearchLayout";

interface EmployeeAdvancedSearchFieldsProps {
  state: EmployeeAdvancedSearchState;
}

const leaveStatusOptions = [
  { id: "any", label: "Any leave status" },
  { id: "onLeave", label: "On leave" },
  { id: "notOnLeave", label: "Not on leave" },
];

export function EmployeeAdvancedSearchFields({
  state,
}: EmployeeAdvancedSearchFieldsProps) {
  const {
    filters,
    branches,
    programAreas,
    jobTitles,
    workspaceAssignmentTypes,
    updateFilter,
    setBranchId,
    setProgramAreaId,
    ohsAccommodationTypes,
    toggleOhsAccommodationTypeId,
  } = state;

  return (
    <>
      <section aria-labelledby="advanced-search-identity-heading">
        <Heading id="advanced-search-identity-heading" level={5}>
          Identity
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="First Name"
            value={filters.firstName ?? ""}
            onChange={(value) => updateFilter("firstName", value)}
          />
          <TextField
            label="Alternate Name"
            value={filters.alternateName ?? ""}
            onChange={(value) => updateFilter("alternateName", value)}
          />
          <TextField
            label="Last Name"
            value={filters.lastName ?? ""}
            onChange={(value) => updateFilter("lastName", value)}
          />
          <TextField
            label="Employee ID"
            value={filters.employeeId ?? ""}
            onChange={(value) => updateFilter("employeeId", value)}
          />
          <TextField
            label="IDIR"
            value={filters.idir ?? ""}
            onChange={(value) => updateFilter("idir", value)}
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-organisation-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-organisation-heading" level={5}>
          Organisation
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Office Number"
            value={filters.officeNumber ?? ""}
            onChange={(value) => updateFilter("officeNumber", value)}
          />
          <Select
            label="Branch"
            items={branches.map((branch) => ({
              id: branch.id,
              label: branch.name,
            }))}
            value={filters.branchId ?? null}
            onChange={(key) =>
              setBranchId(key === null ? undefined : Number(key))
            }
            placeholder="Any branch"
          />
          <Select
            label="Program Area"
            isDisabled={filters.branchId === undefined}
            items={programAreas.map((programArea) => ({
              id: programArea.id,
              label: programArea.name,
            }))}
            value={filters.programAreaId ?? null}
            onChange={(key) =>
              setProgramAreaId(key === null ? undefined : Number(key))
            }
            placeholder="Any program area"
          />
          <Select
            label="Job Title"
            isDisabled={filters.programAreaId === undefined}
            items={jobTitles.map((jobTitle) => ({
              id: jobTitle.id,
              label: jobTitle.name,
            }))}
            value={filters.jobTitleId ?? null}
            onChange={(key) =>
              updateFilter("jobTitleId", key === null ? undefined : Number(key))
            }
            placeholder="Any job title"
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-status-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-status-heading" level={5}>
          Employment Status
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <Select
            label="Leave Status"
            items={leaveStatusOptions}
            value={
              filters.isOnLeave === undefined
                ? "any"
                : filters.isOnLeave
                  ? "onLeave"
                  : "notOnLeave"
            }
            onChange={(key) => {
              if (key === "onLeave") {
                updateFilter("isOnLeave", true);
              } else if (key === "notOnLeave") {
                updateFilter("isOnLeave", false);
              } else {
                updateFilter("isOnLeave", undefined);
              }
            }}
          />
          <Select
            label="Workspace Assignment Type"
            items={workspaceAssignmentTypes.map((assignmentType) => ({
              id: assignmentType.id,
              label: assignmentType.name,
            }))}
            value={filters.workspaceAssignmentTypeId ?? null}
            onChange={(key) =>
              updateFilter(
                "workspaceAssignmentTypeId",
                key === null ? undefined : Number(key),
              )
            }
            placeholder="Any workspace assignment type"
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-assignments-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-assignments-heading" level={5}>
          Assignments
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Workspace Number"
            value={filters.workspaceNumber ?? ""}
            onChange={(value) => updateFilter("workspaceNumber", value)}
          />
          <TextField
            label="Workstation Asset Tag"
            value={filters.workstationAssetTag ?? ""}
            onChange={(value) => updateFilter("workstationAssetTag", value)}
          />
          <TextField
            label="Mobile Device IMEI"
            value={filters.mobileDeviceImei ?? ""}
            onChange={(value) => updateFilter("mobileDeviceImei", value)}
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-employee-other-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-employee-other-heading" level={5}>
          Other Details
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Notes"
            value={filters.notes ?? ""}
            onChange={(value) => updateFilter("notes", value)}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Heading level={6}>
            Occupational Health and Safety Accommodations
          </Heading>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {ohsAccommodationTypes.map((accommodationType) => (
              <Checkbox
                key={accommodationType.id}
                isSelected={
                  filters.ohsAccommodationTypeIds?.includes(
                    accommodationType.id,
                  ) ?? false
                }
                onChange={() =>
                  toggleOhsAccommodationTypeId(accommodationType.id)
                }
              >
                {accommodationType.name}
              </Checkbox>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
