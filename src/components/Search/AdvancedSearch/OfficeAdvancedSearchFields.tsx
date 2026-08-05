import {
  Heading,
  Select,
  TextField,
} from "@bcgov/design-system-react-components";

import type { OfficeAdvancedSearchState } from "@/hooks/search/useOfficeAdvancedSearchState";
import {
  advancedSearchSectionGridStyle,
  advancedSearchSectionStyle,
} from "@/components/Search/AdvancedSearch/advancedSearchLayout";

interface OfficeAdvancedSearchFieldsProps {
  state: OfficeAdvancedSearchState;
}

export function OfficeAdvancedSearchFields({
  state,
}: OfficeAdvancedSearchFieldsProps) {
  const { filters, officeTypes, clientServiceTypes, updateFilter } = state;

  return (
    <>
      <section aria-labelledby="advanced-search-office-details-heading">
        <Heading id="advanced-search-office-details-heading" level={5}>
          Office Details
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Office Number"
            value={filters.officeNumber ?? ""}
            onChange={(value) => updateFilter("officeNumber", value)}
          />
          <TextField
            label="Office Name"
            value={filters.officeName ?? ""}
            onChange={(value) => updateFilter("officeName", value)}
          />
          <Select
            label="Type of Office"
            items={officeTypes.map((officeType) => ({
              id: officeType.id,
              label: officeType.name,
            }))}
            value={filters.officeTypeId ?? null}
            onChange={(value) =>
              updateFilter(
                "officeTypeId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any office type"
          />
          <Select
            label="Type of Client Services"
            items={clientServiceTypes.map((clientServiceType) => ({
              id: clientServiceType.id,
              label: clientServiceType.name,
            }))}
            value={filters.clientServiceTypeId ?? null}
            onChange={(value) =>
              updateFilter(
                "clientServiceTypeId",
                value === null ? undefined : Number(value),
              )
            }
            placeholder="Any client service type"
          />
        </div>
      </section>

      <section
        aria-labelledby="advanced-search-office-address-heading"
        style={advancedSearchSectionStyle}
      >
        <Heading id="advanced-search-office-address-heading" level={5}>
          Address
        </Heading>
        <div style={advancedSearchSectionGridStyle}>
          <TextField
            label="Street Address"
            value={filters.address ?? ""}
            onChange={(value) => updateFilter("address", value)}
          />
          <TextField
            label="City"
            value={filters.city ?? ""}
            onChange={(value) => updateFilter("city", value)}
          />
          <TextField
            label="Postal Code"
            value={filters.postalCode ?? ""}
            onChange={(value) => updateFilter("postalCode", value)}
          />
        </div>
      </section>
    </>
  );
}
