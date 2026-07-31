import {useEffect, useState} from "react";


export function useLookup<T>(
    fetcher: () => Promise<T>,
    label: string
) {
    const [data, setData] = useState<T | null>(null);

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
