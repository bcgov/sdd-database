"use server";

import { getDeskTypes, getWorkspaceCategories } from "@/db/data-access/lookups";
import type { LookupOption } from "@/types";

export type WorkspaceLookupOptions = {
  categories: LookupOption[];
  deskTypes: LookupOption[];
};

export async function fetchWorkspaceLookupsAction(): Promise<WorkspaceLookupOptions> {
  const [categories, deskTypes] = await Promise.all([
    getWorkspaceCategories(),
    getDeskTypes(),
  ]);

  return { categories, deskTypes };
}
