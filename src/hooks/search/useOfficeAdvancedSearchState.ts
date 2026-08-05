import type { LookupOption, OfficeAdvancedSearchFilters } from "@/types";
import { useOfficeTypes } from "@/hooks/lookups/useOfficeTypes";
import { useTypesOfClientServices } from "@/hooks/lookups/useTypesOfClientServices";
import {
  useAdvancedSearchFilterState,
  type AdvancedSearchFilterState,
} from "@/hooks/search/useAdvancedSearchFilterState";

export interface OfficeAdvancedSearchState extends AdvancedSearchFilterState<OfficeAdvancedSearchFilters> {
  officeTypes: LookupOption[];
  clientServiceTypes: LookupOption[];
}

export function useOfficeAdvancedSearchState(): OfficeAdvancedSearchState {
  const filterState =
    useAdvancedSearchFilterState<OfficeAdvancedSearchFilters>();
  const { officeTypes } = useOfficeTypes();
  const { typesOfClientServices } = useTypesOfClientServices();

  return {
    ...filterState,
    officeTypes: officeTypes ?? [],
    clientServiceTypes: typesOfClientServices ?? [],
  };
}
