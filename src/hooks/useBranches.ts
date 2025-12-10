import {useEffect, useState} from "react";

import {fetchBranches} from "@/actions/branches";

import {BranchOption} from "@/types";


export function useBranches() {

    const [branches, setBranches] = useState<BranchOption[] | null>(null);

    useEffect(() => {

        let isAlive = true; // to check if component is mounted

        (async () => {

            try {
                const data = await fetchBranches();

                if (!isAlive) return;   // do not modify state if component is unmounted

                setBranches(data);
            } catch (e) {
                console.error("Failed to fetch branches:", e);
            }
        })()

        return () => {
            isAlive = false;
        }

    }, []);

    return { branches };
}
