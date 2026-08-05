import type { EmployeeAdvancedSearchFilters } from "@/types";

export function hasAdvancedSearchCriteria<TFilters extends object>(
  query: string | undefined,
  filters: TFilters,
) {
  if (query?.trim()) return true;

  return Object.values(filters).some((value) => {
    if (typeof value === "string") return Boolean(value.trim());
    if (Array.isArray(value)) return value.length > 0;

    return value !== undefined;
  });
}

export function hasEmployeeAdvancedSearchCriteria(
  query: string | undefined,
  filters: EmployeeAdvancedSearchFilters,
) {
  return hasAdvancedSearchCriteria(query, filters);
}
