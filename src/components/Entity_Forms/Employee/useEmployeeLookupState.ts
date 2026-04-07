import {EmployeeFormValues, EmployeeSearchResult, LookupOption} from "@/types";
import {useBranches} from "@/hooks/lookups/useBranches";
import {Dispatch, SetStateAction, useState} from "react";
import {useProgramAreas} from "@/hooks/lookups/useProgramAreas";
import {useJobTitles} from "@/hooks/lookups/useJobTitles";


type EmployeeLike = EmployeeFormValues | EmployeeSearchResult | undefined

export interface EmployeeLookupState {
    branches: LookupOption[]
    programAreas: LookupOption[]
    jobTitles: LookupOption[]
    selectedBranchId: number | undefined
    handleBranchSelectionChange: (branchId: number | undefined) => void
    selectedProgramAreaId: number | undefined
    handleProgramAreaSelectionChange: (programAreaId: number | undefined) => void
    selectedJobTitleId: number | undefined
    setSelectedJobTitleId: Dispatch<SetStateAction<number | undefined>>
    isJobTitleRequired: boolean
}

export function useEmployeeLookupState(employee: EmployeeLike): EmployeeLookupState {
    const {branches} = useBranches(); // [{ id, name }, {id, name}] or null on first render

    const uiBranchId = employee && "ui_branch_id" in employee
        ? employee.ui_branch_id
        : undefined
    const hydratedBranchId = employee && "program_area" in employee
        ? employee.program_area?.branch_id
        : undefined

    const initialSelectedBranchId = uiBranchId ?? hydratedBranchId
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(initialSelectedBranchId);

    const {programAreas} = useProgramAreas(selectedBranchId);

    const initialSelectedProgramAreaId = employee?.program_area_id
    const [selectedProgramAreaId, setSelectedProgramAreaId] = useState<number | undefined>(initialSelectedProgramAreaId)

    const initialSelectedJobTitleId = employee?.job_title_id ?? undefined
    const [selectedJobTitleId, setSelectedJobTitleId] = useState<number | undefined>(initialSelectedJobTitleId)

    const {jobTitles} = useJobTitles(selectedProgramAreaId)

    const selectedBranch = (branches ?? []).find(branch => branch.id === selectedBranchId)
    const isNonSddBranch = selectedBranch?.name === "Non SDD"
    const isJobTitleRequired = !isNonSddBranch

    const handleBranchSelectionChange = (branchId: number | undefined) => {
        setSelectedBranchId(branchId)
        setSelectedProgramAreaId(undefined)
        setSelectedJobTitleId(undefined)
    }

    const handleProgramAreaSelectionChange = (programAreaId: number | undefined)=> {
        setSelectedProgramAreaId(programAreaId)
        setSelectedJobTitleId(undefined)
    }

    return {
        branches: branches ?? [],
        programAreas: programAreas ?? [],
        jobTitles: jobTitles ?? [],
        selectedBranchId,
        handleBranchSelectionChange,
        selectedProgramAreaId,
        handleProgramAreaSelectionChange,
        selectedJobTitleId,
        setSelectedJobTitleId,
        isJobTitleRequired
    }
}
