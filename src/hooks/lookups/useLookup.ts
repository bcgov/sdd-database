import {useEffect, useState} from "react";
import {LookupOption} from "@/types";


export function useLookup(
    fetcher: () => Promise<LookupOption[]>,
    label: string
) {
    const [data, setData] = useState<LookupOption[] | null>(null);

    useEffect(() => {
        let isAlive = true;

        (async () => {
            try {
                const rows = await fetcher();

                if (!isAlive) return // do not modify state if component is unmounted

                setData(rows);
            } catch (error) {
                console.error(`Failed to fetch ${label}: `, error);

                if (isAlive) setData(null)
            }
        })()

        return () => {
            isAlive = false;
        }
    }, [fetcher, label]);

    return {data}
}
