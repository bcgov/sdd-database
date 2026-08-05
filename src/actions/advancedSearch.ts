"use server";

import type { AdvancedSearchRequest, Entity } from "@/types";
import { searchEmployeesWithAdvancedFiltersAction } from "@/actions/entities/employee/actions";
import { searchOfficesWithAdvancedFiltersAction } from "@/actions/entities/offices";
import { searchWorkspacesWithAdvancedFiltersAction } from "@/actions/entities/workspaces";
import { searchWorkstationsWithAdvancedFiltersAction } from "@/actions/entities/workstation/actions";
import { searchMobileDevicesWithAdvancedFiltersAction } from "@/actions/entities/mobile-device/actions";
import { searchMobilePlansWithAdvancedFiltersAction } from "@/actions/entities/mobile-plan/actions";

export async function advancedSearchAction(
  request: AdvancedSearchRequest,
): Promise<Entity[]> {
  switch (request.entityType) {
    case "employee":
      return searchEmployeesWithAdvancedFiltersAction(request);

    case "office":
      return searchOfficesWithAdvancedFiltersAction(request);

    case "workspace":
      return searchWorkspacesWithAdvancedFiltersAction(request);

    case "workstation":
      return searchWorkstationsWithAdvancedFiltersAction(request);

    case "mobileDevice":
      return searchMobileDevicesWithAdvancedFiltersAction(request);

    case "mobilePlan":
      return searchMobilePlansWithAdvancedFiltersAction(request);

    default:
      throw new Error("Unknown advanced search entity.");
  }
}
