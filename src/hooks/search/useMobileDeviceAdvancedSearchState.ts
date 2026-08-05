import type { LookupOption, MobileDeviceAdvancedSearchFilters } from "@/types";
import { useMobileDeviceModels } from "@/hooks/lookups/useMobileDeviceModels";
import {
  useAdvancedSearchFilterState,
  type AdvancedSearchFilterState,
} from "@/hooks/search/useAdvancedSearchFilterState";

export interface MobileDeviceAdvancedSearchState extends AdvancedSearchFilterState<MobileDeviceAdvancedSearchFilters> {
  models: LookupOption[];
}

export function useMobileDeviceAdvancedSearchState(): MobileDeviceAdvancedSearchState {
  const filterState =
    useAdvancedSearchFilterState<MobileDeviceAdvancedSearchFilters>();
  const { mobileDeviceModels } = useMobileDeviceModels();

  return {
    ...filterState,
    models: mobileDeviceModels ?? [],
  };
}
