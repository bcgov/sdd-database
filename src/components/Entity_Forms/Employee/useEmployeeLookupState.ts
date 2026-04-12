import {EmployeeFormValues, EmployeeSearchResult, LookupOption} from "@/types";
import {useBranches} from "@/hooks/lookups/useBranches";
import {Dispatch, SetStateAction, useState} from "react";
import {useProgramAreas} from "@/hooks/lookups/useProgramAreas";
import {useJobTitles} from "@/hooks/lookups/useJobTitles";
import {useOhsAccommodationTypes} from "@/hooks/lookups/useOhsAccommodationTypes";


type EmployeeLike = EmployeeFormValues | EmployeeSearchResult | undefined

export interface EmployeeLookupState {
    branches: LookupOption[]
    programAreas: LookupOption[]
    jobTitles: LookupOption[]
    ohsAccommodationTypes: LookupOption[]

    selectedBranchId: number | undefined
    handleBranchSelectionChange: (branchId: number | undefined) => void
    selectedProgramAreaId: number | undefined
    handleProgramAreaSelectionChange: (programAreaId: number | undefined) => void
    selectedJobTitleId: number | undefined
    setSelectedJobTitleId: Dispatch<SetStateAction<number | undefined>>
    selectedOhsAccommodationTypeIds: number[]

    isJobTitleRequired: boolean
}

export function useEmployeeLookupState(employee: EmployeeLike): EmployeeLookupState {

    // branches
    const {branches} = useBranches(); // [{ id, name }, {id, name}] or null on first render

    const uiBranchId = employee && "ui_branch_id" in employee
        ? employee.ui_branch_id
        : undefined
    const hydratedBranchId = employee && "program_area" in employee
        ? employee.program_area?.branch_id
        : undefined

    const initialSelectedBranchId = uiBranchId ?? hydratedBranchId
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(initialSelectedBranchId);

    // programAreas
    const {programAreas} = useProgramAreas(selectedBranchId);

    const initialSelectedProgramAreaId = employee?.program_area_id
    const [selectedProgramAreaId, setSelectedProgramAreaId] = useState<number | undefined>(initialSelectedProgramAreaId)

    const initialSelectedJobTitleId = employee?.job_title_id ?? undefined
    const [selectedJobTitleId, setSelectedJobTitleId] = useState<number | undefined>(initialSelectedJobTitleId)

    // job titles
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

    // OHS Accommodations
    const {ohsAccommodationTypes} = useOhsAccommodationTypes();

    let initialSelectedOhsAccommodationTypeIds: number[] = []

    // if employee is of type EmployeeFormValues
    if (employee && "ohs_accommodation_type_ids" in employee) {
        initialSelectedOhsAccommodationTypeIds = employee.ohs_accommodation_type_ids
    }
    else {
        // if employee is of type EmployeeSearchResult
        if (employee && "ohs_accommodations" in employee) {

            initialSelectedOhsAccommodationTypeIds = employee.ohs_accommodations.map(
                accommodation => accommodation.ohs_accommodation_type_id
            )
        }
    }

    return {
        branches: branches ?? [],
        programAreas: programAreas ?? [],
        jobTitles: jobTitles ?? [],
        ohsAccommodationTypes: ohsAccommodationTypes ?? [],

        selectedBranchId,
        handleBranchSelectionChange,
        selectedProgramAreaId,
        handleProgramAreaSelectionChange,
        selectedJobTitleId,
        setSelectedJobTitleId,
        selectedOhsAccommodationTypeIds: initialSelectedOhsAccommodationTypeIds,

        isJobTitleRequired
    }
}
