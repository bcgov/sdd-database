import { useCallback } from "react";

import {
  fetchWorkspaceLookupsAction,
  type WorkspaceLookupOptions,
} from "@/actions/lookups/workspaces";
import { useLookup } from "@/hooks/lookups/useLookup";

export function useWorkspaceLookups() {
  const fetcher = useCallback(
    (): Promise<WorkspaceLookupOptions> => fetchWorkspaceLookupsAction(),
    [],
  );
  const { data } = useLookup(fetcher, "workspace lookup options");

  return {
    workspaceCategories: data?.categories ?? [],
    deskTypes: data?.deskTypes ?? [],
  };
}
