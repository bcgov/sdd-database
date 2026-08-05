import { useCallback, useOptimistic, useState } from "react";
import type { Selection } from "@react-types/shared";

import {
  AdvancedSearchRequest,
  AssignMode,
  Entity,
  EntityType,
  SearchOptions,
} from "@/types";

import { searchOfficesAction } from "@/actions/entities/offices";
import { searchAllAction } from "@/actions/search";
import { advancedSearchAction } from "@/actions/advancedSearch";
import { searchAssignableWorkspacesAction } from "@/actions/entities/workspaces";
import { searchAssignableWorkstationsAction } from "@/actions/entities/workstation/actions";
import { searchAssignableMobileDevicesAction } from "@/actions/entities/mobile-device/actions";
import { searchAssignableMobilePlansAction } from "@/actions/entities/mobile-plan/actions";
import { useEmployeeAdvancedSearchState } from "@/hooks/search/useEmployeeAdvancedSearchState";
import { useOfficeAdvancedSearchState } from "@/hooks/search/useOfficeAdvancedSearchState";
import { useWorkspaceAdvancedSearchState } from "@/hooks/search/useWorkspaceAdvancedSearchState";
import { useWorkstationAdvancedSearchState } from "@/hooks/search/useWorkstationAdvancedSearchState";
import { useMobileDeviceAdvancedSearchState } from "@/hooks/search/useMobileDeviceAdvancedSearchState";
import { useMobilePlanAdvancedSearchState } from "@/hooks/search/useMobilePlanAdvancedSearchState";

type ExecutedSearch =
  | {
      kind: "global";
      query?: string;
    }
  | {
      kind: "advanced";
      request: AdvancedSearchRequest;
    }
  | {
      kind: "assignment";
      query?: string;
      options: SearchOptions;
    };

export function useSearch() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [lastExecutedSearch, setLastExecutedSearch] =
    useState<ExecutedSearch>();
  const [selectedFilterTags, setSelectedFilterTags] = useState<Selection>(
    new Set<string>(),
  );
  const [searchResults, setSearchResults] = useState<Entity[]>([]);
  const employeeAdvancedSearch = useEmployeeAdvancedSearchState();
  const officeAdvancedSearch = useOfficeAdvancedSearchState();
  const workspaceAdvancedSearch = useWorkspaceAdvancedSearchState();
  const workstationAdvancedSearch = useWorkstationAdvancedSearchState();
  const mobileDeviceAdvancedSearch = useMobileDeviceAdvancedSearchState();
  const mobilePlanAdvancedSearch = useMobilePlanAdvancedSearchState();

  const [assignMode, setAssignMode] = useState<AssignMode>("none");
  const [assignEmployeeOfficeNumber, setAssignEmployeeOfficeNumber] =
    useState<string>();
  const [assignEmployeeProgramAreaId, setAssignEmployeeProgramAreaId] =
    useState<number>();
  const [
    assignEmployeeWorkstationAssetTags,
    setAssignEmployeeWorkstationAssetTags,
  ] = useState<string[]>([]);

  const filteredSearchResults = searchResults.filter((item) => {
    if (selectedFilterTags === "all") return true;

    if (selectedFilterTags.size === 0) return true;

    return selectedFilterTags.has(item.type);
  });

  // A reducer function used for optimistic deletes.
  const excludeEntityReducer = (
    filteredSearchResults: Entity[],
    deletedEntity: Entity,
  ) =>
    filteredSearchResults.filter((item) => {
      if (item.type !== deletedEntity.type) return true;

      if (item.type === "employee" && deletedEntity.type === "employee") {
        return item.id !== deletedEntity.id;
      }

      if (item.type === "workstation" && deletedEntity.type === "workstation") {
        return item.asset_tag !== deletedEntity.asset_tag;
      }

      return true;
    });

  const [optimisticSearchResults, setOptimisticSearchResults] = useOptimistic(
    filteredSearchResults,
    excludeEntityReducer,
  );

  const searchResultsAreEmpty = searchResults.length === 0;

  const handleSearch = async (formData: FormData) => {
    const query = (formData.get("search") as string | null) ?? "";
    setSearchPhrase(query);
    setHasSearched(true);

    await runSearch(query);
  };

  const runSearch = useCallback(
    async (query?: string, options?: SearchOptions) => {
      const effectiveMode = options?.modeOverride ?? assignMode;
      const effectiveEmployeeOfficeNumber =
        options?.employeeOfficeNumber ?? assignEmployeeOfficeNumber;
      const effectiveEmployeeProgramAreaId =
        options?.employeeProgramAreaId ?? assignEmployeeProgramAreaId;
      const effectiveEmployeeWorkstationAssetTags =
        options?.employeeWorkstationAssetTags ??
        assignEmployeeWorkstationAssetTags;

      let results: Entity[] = [];

      switch (effectiveMode) {
        case "office":
          results = await searchOfficesAction(query);
          break;

        case "workspace":
          if (
            !effectiveEmployeeOfficeNumber ||
            effectiveEmployeeProgramAreaId == null
          ) {
            console.warn(
              "Workspace search requested without employee office number or employee program area id",
            );
            results = [];
          } else {
            results = await searchAssignableWorkspacesAction(
              effectiveEmployeeOfficeNumber,
              effectiveEmployeeProgramAreaId,
              query,
            );
          }
          break;

        case "workstation":
          const workstationResults =
            await searchAssignableWorkstationsAction(query);

          results = workstationResults.filter(
            (workstation) =>
              !effectiveEmployeeWorkstationAssetTags.includes(
                workstation.asset_tag,
              ),
          );

          break;

        case "mobileDevice":
          results = await searchAssignableMobileDevicesAction(query);
          break;

        case "mobilePlan":
          results = await searchAssignableMobilePlansAction(query);
          break;

        case "none":
          results = await searchAllAction(query);
          break;
      }

      setSearchResults(results);
      setLastExecutedSearch(
        effectiveMode === "none"
          ? { kind: "global", query }
          : {
              kind: "assignment",
              query,
              options: {
                modeOverride: effectiveMode,
                employeeOfficeNumber: effectiveEmployeeOfficeNumber,
                employeeProgramAreaId: effectiveEmployeeProgramAreaId,
                employeeWorkstationAssetTags:
                  effectiveEmployeeWorkstationAssetTags,
              },
            },
      );
    },
    [
      assignMode,
      assignEmployeeOfficeNumber,
      assignEmployeeProgramAreaId,
      assignEmployeeWorkstationAssetTags,
    ],
  );

  const runAdvancedSearchRequest = useCallback(
    async (request: AdvancedSearchRequest) => {
      const results = await advancedSearchAction(request);
      setSearchResults(results);
    },
    [],
  );

  const runAdvancedSearch = useCallback(
    async (entityType: EntityType) => {
      if (assignMode !== "none") {
        throw new Error(
          "Advanced search is unavailable while assigning an entity.",
        );
      }

      let request: AdvancedSearchRequest;

      switch (entityType) {
        case "employee":
          request = {
            entityType,
            query: searchPhrase,
            filters: employeeAdvancedSearch.filters,
          };
          break;
        case "office":
          request = {
            entityType,
            query: searchPhrase,
            filters: officeAdvancedSearch.filters,
          };
          break;
        case "workspace":
          request = {
            entityType,
            query: searchPhrase,
            filters: workspaceAdvancedSearch.filters,
          };
          break;
        case "workstation":
          request = {
            entityType,
            query: searchPhrase,
            filters: workstationAdvancedSearch.filters,
          };
          break;
        case "mobileDevice":
          request = {
            entityType,
            query: searchPhrase,
            filters: mobileDeviceAdvancedSearch.filters,
          };
          break;
        case "mobilePlan":
          request = {
            entityType,
            query: searchPhrase,
            filters: mobilePlanAdvancedSearch.filters,
          };
          break;
      }

      await runAdvancedSearchRequest(request);
      setSelectedFilterTags(new Set<string>());
      setHasSearched(true);
      setLastExecutedSearch({ kind: "advanced", request });
    },
    [
      assignMode,
      employeeAdvancedSearch.filters,
      mobileDeviceAdvancedSearch.filters,
      mobilePlanAdvancedSearch.filters,
      officeAdvancedSearch.filters,
      runAdvancedSearchRequest,
      searchPhrase,
      workstationAdvancedSearch.filters,
      workspaceAdvancedSearch.filters,
    ],
  );

  const refreshSearchResults = useCallback(() => {
    if (!lastExecutedSearch) return;

    if (lastExecutedSearch.kind === "advanced") {
      void runAdvancedSearchRequest(lastExecutedSearch.request);
      return;
    }

    void runSearch(
      lastExecutedSearch.query,
      lastExecutedSearch.kind === "assignment"
        ? lastExecutedSearch.options
        : undefined,
    );
  }, [lastExecutedSearch, runAdvancedSearchRequest, runSearch]);

  return {
    selectedFilterTags,
    setSelectedFilterTags,

    searchPhrase,
    setSearchPhrase,
    employeeAdvancedSearch,
    officeAdvancedSearch,
    workspaceAdvancedSearch,
    workstationAdvancedSearch,
    mobileDeviceAdvancedSearch,
    mobilePlanAdvancedSearch,

    assignMode,
    setAssignMode,
    setAssignEmployeeOfficeNumber,
    setAssignEmployeeProgramAreaId,
    setAssignEmployeeWorkstationAssetTags,

    optimisticSearchResults,
    setOptimisticSearchResults,
    userHasSearchedOnce: () => hasSearched,
    searchResultsAreEmpty,
    handleSearch,
    runSearch,
    runAdvancedSearch,
    refreshSearchResults,
  };
}
