import type { LookupOption, MobilePlanAdvancedSearchFilters } from "@/types";
import { useMobilePlanLookups } from "@/hooks/lookups/useMobilePlanLookups";
import {
  useAdvancedSearchFilterState,
  type AdvancedSearchFilterState,
} from "@/hooks/search/useAdvancedSearchFilterState";

export interface MobilePlanAdvancedSearchState extends AdvancedSearchFilterState<MobilePlanAdvancedSearchFilters> {
  statuses: LookupOption[];
  serviceProviders: LookupOption[];
}

export function useMobilePlanAdvancedSearchState(): MobilePlanAdvancedSearchState {
  const filterState =
    useAdvancedSearchFilterState<MobilePlanAdvancedSearchFilters>();
  const { mobilePlanStatuses, mobilePlanServiceProviders } =
    useMobilePlanLookups();

  return {
    ...filterState,
    statuses: mobilePlanStatuses,
    serviceProviders: mobilePlanServiceProviders,
  };
}
