"use server";

import {LookupOption} from "@/types";
import {getWorkspaceAssignmentTypes} from "@/db/data-access/lookups";


export async function fetchWorkspaceAssignmentTypesAction(): Promise<LookupOption[]> {
    return getWorkspaceAssignmentTypes()
}
