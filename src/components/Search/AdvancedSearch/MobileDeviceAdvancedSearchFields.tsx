import { parseDate } from "@internationalized/date";
import {
  DatePicker,
  Heading,
  Select,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";

import type { MobileDeviceAdvancedSearchState } from "@/hooks/search/useMobileDeviceAdvancedSearchState";
import {
  advancedSearchSectionGridStyle,
  advancedSearchSectionStyle,
} from "@/components/Search/AdvancedSearch/advancedSearchLayout";

interface MobileDeviceAdvancedSearchFieldsProps {
  state: MobileDeviceAdvancedSearchState;
}

const mobileDeviceStatusOptions = [
  { id: "unassigned", label: "Redeploy (available for assignment)" },
  { id: "assigned", label: "Assigned to an employee" },
  { id: "adr", label: "Disposed" },
  { id: "gilr", label: "Lost / Stolen" },
];

const assignmentOptions = [
  { id: "any", label: "Any employee assignment" },
  { id: "assigned", label: "Assigned to an employee" },
  {
    id: "unassigned",
    label: "No employee assigned (any device status)",
  },
];

const mobilePlanOptions = [
  { id: "any", label: "Any mobile plan state" },
  { id: "hasPlan", label: "Has a mobile plan" },
  { id: "noPlan", label: "No mobile plan" },
];

function getCalendarDate(value?: string) {
  if (!value) return null;

  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

export function MobileDeviceAdvancedSearchFields({
  state,
}: MobileDeviceAdvancedSearchFieldsProps) {
  const { filters, models, updateFilter } = state;

  return (
    <>
      <section aria-labelledby="advanced-search-mobile-device-details-heading">
        <Heading id="advanced-search-mobile-device-details-heading" level={5}>
          Mobile Device Details
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
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
            label="IMEI"
            value={filters.imei ?? ""}
            onChange={(value) => updateFilter("imei", value)}
          />
          <TextField
            label="Office Number"
            value={filters.officeNumber ?? ""}
            onChange={(value) => updateFilter("officeNumber", value)}
          />
          <DatePicker
            label="Order Date"
            isBrowserLocaleUsed
            value={getCalendarDate(filters.orderDate)}
            onChange={(value) =>
              updateFilter("orderDate", value?.toString() || undefined)
            }
          />
          <DatePicker
            label="Payment End Date"
            isBrowserLocaleUsed
            value={getCalendarDate(filters.paymentEndDate)}
            onChange={(value) =>
              updateFilter("paymentEndDate", value?.toString() || undefined)
            }
          />
          <Select
            label="Device Status"
            items={mobileDeviceStatusOptions}
            value={filters.status ?? null}
            onChange={(value) => {
              if (
                value === "unassigned" ||
                value === "assigned" ||
                value === "adr" ||
                value === "gilr"
              ) {
                updateFilter("status", value);
              } else {
                updateFilter("status", undefined);
              }
            }}
            placeholder="Any status"
          />
          <TextField
            label="Asset Disposal Report Number"
            value={filters.adr ?? ""}
            onChange={(value) => updateFilter("adr", value)}
          />
          <TextField
            label="General Incident Loss Report Number"
            value={filters.gilr ?? ""}
            onChange={(value) => updateFilter("gilr", value)}
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
        aria-labelledby="advanced-search-mobile-device-assignment-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading
          id="advanced-search-mobile-device-assignment-heading"
          level={5}
        >
          Assignment
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <Select
            label="Employee Assignment"
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
          <Select
            label="Mobile Plan"
            items={mobilePlanOptions}
            value={
              filters.hasMobilePlan === undefined
                ? "any"
                : filters.hasMobilePlan
                  ? "hasPlan"
                  : "noPlan"
            }
            onChange={(value) =>
              updateFilter(
                "hasMobilePlan",
                value === "hasPlan"
                  ? true
                  : value === "noPlan"
                    ? false
                    : undefined,
              )
            }
          />
          <TextField
            label="Mobile Plan Phone Number"
            value={filters.mobilePlanPhoneNumber ?? ""}
            onChange={(value) => updateFilter("mobilePlanPhoneNumber", value)}
          />
        </div>
      </section>
    </>
  );
}
