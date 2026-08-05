import {
  Heading,
  Select,
  TextField,
} from "@bcgov/design-system-react-components";

import type { MobilePlanAdvancedSearchState } from "@/hooks/search/useMobilePlanAdvancedSearchState";
import {
  advancedSearchSectionGridStyle,
  advancedSearchSectionStyle,
} from "@/components/Search/AdvancedSearch/advancedSearchLayout";

interface MobilePlanAdvancedSearchFieldsProps {
  state: MobilePlanAdvancedSearchState;
}

const dataAllowanceOptions = [
  { id: 6, label: "6 GB" },
  { id: 20, label: "20 GB" },
  { id: 100, label: "100 GB" },
];

const voicemailOptions = [
  { id: "any", label: "Any voicemail setting" },
  { id: "enabled", label: "Enhanced voicemail enabled" },
  { id: "disabled", label: "Enhanced voicemail disabled" },
];

const assignmentOptions = [
  { id: "any", label: "Any assignment state" },
  { id: "assigned", label: "Assigned" },
  { id: "unassigned", label: "Unassigned" },
];

export function MobilePlanAdvancedSearchFields({
  state,
}: MobilePlanAdvancedSearchFieldsProps) {
  const { filters, statuses, serviceProviders, updateFilter } = state;

  return (
    <>
      <section aria-labelledby="advanced-search-mobile-plan-details-heading">
        <Heading id="advanced-search-mobile-plan-details-heading" level={5}>
          Mobile Plan Details
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Phone Number"
            inputMode="numeric"
            value={filters.phoneNumber ?? ""}
            onChange={(value) => updateFilter("phoneNumber", value)}
          />
          <Select
            label="Service Provider"
            items={serviceProviders.map((serviceProvider) => ({
              id: serviceProvider.id,
              label: serviceProvider.name,
            }))}
            value={filters.serviceProviderId ?? null}
            onChange={(value) =>
              updateFilter(
                "serviceProviderId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any service provider"
          />
          <Select
            label="Data Allowance"
            items={dataAllowanceOptions}
            value={filters.dataAllowanceGb ?? null}
            onChange={(value) =>
              updateFilter(
                "dataAllowanceGb",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any data allowance"
          />
          <Select
            label="Enhanced Voicemail"
            items={voicemailOptions}
            value={
              filters.enhancedVoicemail === undefined
                ? "any"
                : filters.enhancedVoicemail
                  ? "enabled"
                  : "disabled"
            }
            onChange={(value) =>
              updateFilter(
                "enhancedVoicemail",
                value === "enabled"
                  ? true
                  : value === "disabled"
                    ? false
                    : undefined,
              )
            }
          />
          <Select
            label="Status"
            items={statuses.map((status) => ({
              id: status.id,
              label: status.name,
            }))}
            value={filters.statusId ?? null}
            onChange={(value) =>
              updateFilter(
                "statusId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any status"
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-mobile-plan-assignment-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-mobile-plan-assignment-heading" level={5}>
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
            label="Assigned Mobile Device IMEI"
            value={filters.assignedMobileDeviceImei ?? ""}
            onChange={(value) =>
              updateFilter("assignedMobileDeviceImei", value)
            }
          />
        </div>
      </section>
    </>
  );
}
