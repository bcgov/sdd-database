import {useEffect, useState} from "react";

import {fetchJobTitlesByProgramArea} from "@/actions/lookups/jobTitles";

import {LookupOption} from "@/types";


export function useJobTitles(programAreaId?: number) {

    const [jobTitles, setJobTitles] = useState<LookupOption[] | null>(null)

    useEffect(() => {

        let isAlive = true;

        (async () => {
            // No program area selected yet -> clear options
            if (programAreaId == null) {
                if (isAlive) setJobTitles(null)
                return
            }

            try {
                const data = await fetchJobTitlesByProgramArea(programAreaId)

                if (!isAlive) return

                setJobTitles(data)
            } catch (e) {
                console.error("Failed to fetch programAreas: ", e)

                if (isAlive) setJobTitles(null)
            }
        })()

        return () => {
            isAlive = false
        }
    }, [programAreaId])

    return { jobTitles }
}
