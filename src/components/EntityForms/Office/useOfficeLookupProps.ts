import {useOfficeTypes} from "@/hooks/lookups/useOfficeTypes";
import {useTypesOfClientServices} from "@/hooks/lookups/useTypesOfClientServices";


export function useOfficeLookupProps() {
    /**
     * LookupOption[] | null
     * i.e. [{ id, name }, {id, name}] or null on first render
     */
    const { officeTypes } = useOfficeTypes();
    const { typesOfClientServices } = useTypesOfClientServices();

    return {
        officeTypes: (officeTypes ?? []),
        typesOfClientServices: (typesOfClientServices ?? []),
    }
}
