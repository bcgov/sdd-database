import type { LookupOption, WorkstationAdvancedSearchFilters } from "@/types";
import { useWorkstationModels } from "@/hooks/lookups/useWorkstationModels";
import {
  useAdvancedSearchFilterState,
  type AdvancedSearchFilterState,
} from "@/hooks/search/useAdvancedSearchFilterState";

export interface WorkstationAdvancedSearchState extends AdvancedSearchFilterState<WorkstationAdvancedSearchFilters> {
  models: LookupOption[];
}

export function useWorkstationAdvancedSearchState(): WorkstationAdvancedSearchState {
  const filterState =
    useAdvancedSearchFilterState<WorkstationAdvancedSearchFilters>();
  const { workstationModels } = useWorkstationModels();

  return {
    ...filterState,
    models: workstationModels ?? [],
  };
}
