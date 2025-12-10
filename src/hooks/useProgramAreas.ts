import {useEffect, useState} from "react";

import {fetchProgramAreasByBranch} from "@/actions/programAreas";

import {ProgramAreaOption} from "@/types";


export function useProgramAreas(branchId?: number) {

    const [programAreas, setProgramAreas] = useState<ProgramAreaOption[] | null>(null);

    useEffect(() => {

        let isAlive = true;

        (async () => {
            // No branch selected yet -> clear options
            if (branchId == null) { // loose inequality to cover both undefined as well as null
                if(isAlive) setProgramAreas(null);
                return;
            }

            try {
                const data = await fetchProgramAreasByBranch(branchId);

                if (!isAlive) return;

                setProgramAreas(data);
            } catch (e) {
                console.error("Failed to fetch programAreas: ", e);
                if (isAlive) setProgramAreas(null);
            }
        })()

        return () => {
            isAlive = false;
        }

    }, [branchId]);

    return { programAreas };
}
