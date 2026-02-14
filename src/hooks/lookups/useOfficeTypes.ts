import {useEffect, useState} from "react";

import {fetchOfficeTypes} from "@/actions/officeTypes";

import {LookupOption} from "@/types";


export function useOfficeTypes() {

    const [officeTypes, setOfficeTypes] = useState<LookupOption[] | null>(null);

    useEffect(() => {

        let isAlive = true; // to check if component is mounted

        (async () => {
            
            try {
                const data = await fetchOfficeTypes();

                if (!isAlive) return;   // do not modify state if component is unmounted

                setOfficeTypes(data);
            } catch (e) {
                console.error("Failed to fetch office types: ", e);
            }
        })()

        return () => {
            isAlive = false;
        }

    }, []);

    return { officeTypes }
}
