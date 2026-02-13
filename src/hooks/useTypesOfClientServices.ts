import {useEffect, useState} from "react";

import {fetchTypesOfClientServices} from "@/actions/typesOfClientServices";

import {TypeOfClientServiceOption} from "@/types";


export function useTypesOfClientServices() {

    const [typesOfClientServices, setTypesOfClientServices] = useState<TypeOfClientServiceOption[] | null>(null);

    useEffect(() => {

        let isAlive = true; // to check if component is mounted

        (async () => {
            
            try {
                const data = await fetchTypesOfClientServices();

                if (!isAlive) return;   // do not modify state if component is unmounted

                setTypesOfClientServices(data);
            } catch (e) {
                console.error("Failed to fetch office types: ", e);
            }
        })()

        return () => {
            isAlive = false;
        }

    }, []);

    return { typesOfClientServices }
}
