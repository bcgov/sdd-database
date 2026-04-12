import {LookupOption} from "@/types";
import {useEffect, useState} from "react";


export function useDependentLookup<TParam>(
    param: TParam | null | undefined,
    fetcher: (param: TParam) => Promise<LookupOption[]>,
    label: string
) {
    const [data, setData] = useState<LookupOption[] | null>(null);

    useEffect(() => {
        let isAlive = true;

        (async () => {
            // No param (program area or branch, ....) selected yet -> clear options
            if (param == null) {
                if (isAlive) setData(null)
                return
            }

            try {
                const rows = await fetcher(param)

                if (!isAlive) return

                setData(rows)
            } catch (error) {
                console.error(`Failed to fetch ${label}: `, error)

                if (isAlive) setData(null)
            }
        })()

        return () => {
            isAlive = false
        }
    }, [param, fetcher, label])

    return { data }
}
