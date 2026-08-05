import type { LookupOption, WorkspaceAdvancedSearchFilters } from "@/types";
import { useBranches } from "@/hooks/lookups/useBranches";
import { useProgramAreas } from "@/hooks/lookups/useProgramAreas";
import { useWorkspaceLookups } from "@/hooks/lookups/useWorkspaceLookups";
import {
  useAdvancedSearchFilterState,
  type AdvancedSearchFilterState,
} from "@/hooks/search/useAdvancedSearchFilterState";

export interface WorkspaceAdvancedSearchState extends AdvancedSearchFilterState<WorkspaceAdvancedSearchFilters> {
  branches: LookupOption[];
  programAreas: LookupOption[];
  categories: LookupOption[];
  deskTypes: LookupOption[];
  setRestrictedBranchId: (branchId: number | undefined) => void;
  setRestrictedProgramAreaId: (
    programAreaId: number | null | undefined,
  ) => void;
}

export function useWorkspaceAdvancedSearchState(): WorkspaceAdvancedSearchState {
  const filterState =
    useAdvancedSearchFilterState<WorkspaceAdvancedSearchFilters>();
  const { branches } = useBranches();
  const { programAreas } = useProgramAreas(
    filterState.filters.restrictedBranchId,
  );
  const { workspaceCategories, deskTypes } = useWorkspaceLookups();

  const setRestrictedBranchId = (branchId: number | undefined) => {
    filterState.updateFilter("restrictedBranchId", branchId);
    filterState.updateFilter("restrictedProgramAreaId", undefined);
  };

  const setRestrictedProgramAreaId = (
    programAreaId: number | null | undefined,
  ) => {
    filterState.updateFilter("restrictedProgramAreaId", programAreaId);
  };

  return {
    ...filterState,
    branches: branches ?? [],
    programAreas: programAreas ?? [],
    categories: workspaceCategories,
    deskTypes,
    setRestrictedBranchId,
    setRestrictedProgramAreaId,
  };
}
