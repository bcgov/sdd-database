import {LookupOption} from "@/types";
import {useBranches} from "@/hooks/lookups/useBranches";
import {Dispatch, SetStateAction, useState} from "react";
import {useProgramAreas} from "@/hooks/lookups/useProgramAreas";
import {useJobTitles} from "@/hooks/lookups/useJobTitles";
import {useOhsAccommodationTypes} from "@/hooks/lookups/useOhsAccommodationTypes";
import {EmployeeLike} from "@/components/Entity_Forms/Employee/types";
import {useWorkspaceAssignmentTypes} from "@/hooks/lookups/useWorkspaceAssignmentTypes";


export interface EmployeeLookupState {
    branches: LookupOption[]
    selectedBranchId: number | null
    handleBranchSelectionChange: (branchId: number | null) => void

    programAreas: LookupOption[]
    selectedProgramAreaId: number | null
    handleProgramAreaSelectionChange: (programAreaId: number | null) => void

    jobTitles: LookupOption[]
    selectedJobTitleId: number | null
    setSelectedJobTitleId: Dispatch<SetStateAction<number | null>>
    isJobTitleRequired: boolean

    workspaceAssignmentTypes: LookupOption[]
    selectedWorkspaceAssignmentTypeId: number | null
    setSelectedWorkspaceAssignmentTypeId: Dispatch<SetStateAction<number | null>>

    ohsAccommodationTypes: LookupOption[]
    selectedOhsAccommodationTypeIds: number[]
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

    const initialSelectedBranchId = uiBranchId ?? hydratedBranchId ?? null
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(initialSelectedBranchId);

    // programAreas
    const {programAreas} = useProgramAreas(selectedBranchId ?? undefined);

    const initialSelectedProgramAreaId = employee?.program_area_id ?? null
    const [selectedProgramAreaId, setSelectedProgramAreaId] = useState<number | null>(initialSelectedProgramAreaId)

    // job titles
    const {jobTitles} = useJobTitles(selectedProgramAreaId ?? undefined)

    const initialSelectedJobTitleId = employee?.job_title_id ?? null
    const [selectedJobTitleId, setSelectedJobTitleId] = useState<number | null>(initialSelectedJobTitleId)

    const selectedBranch = (branches ?? []).find(branch => branch.id === selectedBranchId)
    const isNonSddBranch = selectedBranch?.name === "Non SDD"
    const isJobTitleRequired = !isNonSddBranch

    const handleBranchSelectionChange = (branchId: number | null) => {
        setSelectedBranchId(branchId)
        setSelectedProgramAreaId(null)
        setSelectedJobTitleId(null)
    }

    const handleProgramAreaSelectionChange = (programAreaId: number | null)=> {
        setSelectedProgramAreaId(programAreaId)
        setSelectedJobTitleId(null)
    }

    // Workspace Assignment Types
    const {workspaceAssignmentTypes} = useWorkspaceAssignmentTypes()

    const initialSelectedWorkspaceAssignmentTypeId = employee?.workspace_assignment_type_id ?? null
    const [selectedWorkspaceAssignmentTypeId, setSelectedWorkspaceAssignmentTypeId] = useState<number | null>(initialSelectedWorkspaceAssignmentTypeId)

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
        selectedBranchId,
        handleBranchSelectionChange,

        programAreas: programAreas ?? [],
        selectedProgramAreaId,
        handleProgramAreaSelectionChange,

        jobTitles: jobTitles ?? [],
        selectedJobTitleId,
        setSelectedJobTitleId,
        isJobTitleRequired,

        workspaceAssignmentTypes: workspaceAssignmentTypes ?? [],
        selectedWorkspaceAssignmentTypeId,
        setSelectedWorkspaceAssignmentTypeId,

        ohsAccommodationTypes: ohsAccommodationTypes ?? [],
        selectedOhsAccommodationTypeIds: initialSelectedOhsAccommodationTypeIds,
    }
}
