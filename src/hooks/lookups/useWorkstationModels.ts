import {useCallback} from "react";
import {fetchWorkstationModelsAction} from "@/actions/lookups/workstationModels";
import {useLookup} from "@/hooks/lookups/useLookup";


export function useWorkstationModels() {

    const fetcher = useCallback(() => fetchWorkstationModelsAction(), []);

    const {data} = useLookup(fetcher, "workstation models")

    return {workstationModels: data}
}
