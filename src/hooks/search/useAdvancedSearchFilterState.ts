import { useState } from "react";

export interface AdvancedSearchFilterState<TFilters extends object> {
  filters: TFilters;
  updateFilter: <TField extends keyof TFilters>(
    field: TField,
    value: TFilters[TField],
  ) => void;
  clearFilters: () => void;
}

export function useAdvancedSearchFilterState<
  TFilters extends object,
>(): AdvancedSearchFilterState<TFilters> {
  const [filters, setFilters] = useState<TFilters>({} as TFilters);

  const updateFilter = <TField extends keyof TFilters>(
    field: TField,
    value: TFilters[TField],
  ) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({} as TFilters);
  };

  return { filters, updateFilter, clearFilters };
}
