import { useState } from "react";

import type { EmployeeAdvancedSearchFilters, LookupOption } from "@/types";
import { useBranches } from "@/hooks/lookups/useBranches";
import { useJobTitles } from "@/hooks/lookups/useJobTitles";
import { useProgramAreas } from "@/hooks/lookups/useProgramAreas";
import { useWorkspaceAssignmentTypes } from "@/hooks/lookups/useWorkspaceAssignmentTypes";
import { useOhsAccommodationTypes } from "@/hooks/lookups/useOhsAccommodationTypes";

export interface EmployeeAdvancedSearchState {
  filters: EmployeeAdvancedSearchFilters;
  branches: LookupOption[];
  programAreas: LookupOption[];
  jobTitles: LookupOption[];
  workspaceAssignmentTypes: LookupOption[];
  ohsAccommodationTypes: LookupOption[];
  updateFilter: <TField extends keyof EmployeeAdvancedSearchFilters>(
    field: TField,
    value: EmployeeAdvancedSearchFilters[TField],
  ) => void;
  setBranchId: (branchId: number | undefined) => void;
  setProgramAreaId: (programAreaId: number | undefined) => void;
  toggleOhsAccommodationTypeId: (ohsAccommodationTypeId: number) => void;
  clearFilters: () => void;
}

export function useEmployeeAdvancedSearchState(): EmployeeAdvancedSearchState {
  const [filters, setFilters] = useState<EmployeeAdvancedSearchFilters>({});

  const { branches } = useBranches();
  const { programAreas } = useProgramAreas(filters.branchId);
  const { jobTitles } = useJobTitles(filters.programAreaId);
  const { workspaceAssignmentTypes } = useWorkspaceAssignmentTypes();
  const { ohsAccommodationTypes } = useOhsAccommodationTypes();

  const updateFilter = <TField extends keyof EmployeeAdvancedSearchFilters>(
    field: TField,
    value: EmployeeAdvancedSearchFilters[TField],
  ) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const setBranchId = (branchId: number | undefined) => {
    setFilters((current) => ({
      ...current,
      branchId,
      programAreaId: undefined,
      jobTitleId: undefined,
    }));
  };

  const setProgramAreaId = (programAreaId: number | undefined) => {
    setFilters((current) => ({
      ...current,
      programAreaId,
      jobTitleId: undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleOhsAccommodationTypeId = (ohsAccommodationTypeId: number) => {
    setFilters((current) => {
      const selectedIds = current.ohsAccommodationTypeIds ?? [];
      const nextIds = selectedIds.includes(ohsAccommodationTypeId)
        ? selectedIds.filter((id) => id !== ohsAccommodationTypeId)
        : [...selectedIds, ohsAccommodationTypeId];

      return {
        ...current,
        ohsAccommodationTypeIds: nextIds.length > 0 ? nextIds : undefined,
      };
    });
  };

  return {
    filters,
    branches: branches ?? [],
    programAreas: programAreas ?? [],
    jobTitles: jobTitles ?? [],
    workspaceAssignmentTypes: workspaceAssignmentTypes ?? [],
    ohsAccommodationTypes: ohsAccommodationTypes ?? [],
    updateFilter,
    setBranchId,
    setProgramAreaId,
    toggleOhsAccommodationTypeId,
    clearFilters,
  };
}
