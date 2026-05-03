import {useWorkstationModels} from "@/hooks/lookups/useWorkstationModels";


export function useWorkstationLookupProps() {
    const {workstationModels} = useWorkstationModels()

    return {
        // empty array to make the WorkstationDetails component safe on first render when workstationModels is
        // undefined/null
        workstationModels: workstationModels ?? []
    }
}
