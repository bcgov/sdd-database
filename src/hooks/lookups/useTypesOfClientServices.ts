import {useCallback, useEffect, useState} from "react";

import {fetchTypesOfClientServicesAction} from "@/actions/lookups/typesOfClientServices";

import {useLookup} from "@/hooks/lookups/useLookup";


export function useTypesOfClientServices() {

    const fetcher = useCallback(() => fetchTypesOfClientServicesAction(), []);

    const {data} = useLookup(fetcher, "types of client services")

    return { typesOfClientServices: data }
}
