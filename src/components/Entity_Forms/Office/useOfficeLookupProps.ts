import {useOfficeTypes} from "@/hooks/lookups/useOfficeTypes";
import {useTypesOfClientServices} from "@/hooks/lookups/useTypesOfClientServices";

import type {Office} from "@/generated/prisma/client";


export function useOfficeLookupProps(office: Office) {
    /**
     * LookupOption[] | null
     * i.e. [{ id, name }, {id, name}] or null on first render
     */
    const { officeTypes } = useOfficeTypes();
    const { typesOfClientServices } = useTypesOfClientServices();

    return {
        office,
        officeTypes: (officeTypes ?? []),
        typesOfClientServices: (typesOfClientServices ?? []),
    }
}
