import {useCallback} from "react";
import {fetchWorkspaceAssignmentTypesAction} from "@/actions/lookups/workspaceAssignmentTypes";
import {useLookup} from "@/hooks/lookups/useLookup";


export function useWorkspaceAssignmentTypes() {
    const fetcher = useCallback(() => fetchWorkspaceAssignmentTypesAction(), []);

    const {data} = useLookup(fetcher, "workspace assignment types")

    return {workspaceAssignmentTypes: data}
}
