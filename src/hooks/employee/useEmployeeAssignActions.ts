import {
    AssignMode,
    EmployeeEntity,
    EmployeeFormValues,
    Entity, SearchOptions,
    SelectedWorkspaceAssignment
} from "@/types";
import {parseEmployeeFormData} from "@/utils";
import {Dispatch, SetStateAction, useCallback} from "react";
import type {Selection} from "@react-types/shared";


interface EmployeeAssignActionsProps {
    viewedEntity: Entity | undefined
    setViewedEntity: Dispatch<SetStateAction<Entity | undefined>>

    draftNewEmployee: EmployeeFormValues | undefined
    setDraftNewEmployee: Dispatch<SetStateAction<EmployeeFormValues | undefined>>

    draftEditEmployee: EmployeeEntity | undefined
    setDraftEditEmployee: Dispatch<SetStateAction<EmployeeEntity | undefined>>

    isAddNewEmployeeModalOpen: boolean
    openCloseAddNewEmployeeModal: (openModal: boolean, clearDraftEditsOnClose?: boolean) => void
    setIsEntityModalOpen: (isOpen: boolean) => void

    setSelectedFilterTags: Dispatch<SetStateAction<Selection>>

    setAssignMode: (assignMode: AssignMode) => void
    setAssignEmployeeOfficeNumber: (officeNumber: string | undefined) => void
    setAssignEmployeeProgramAreaId: (programAreaId: number | undefined) => void
    setAssignEmployeeWorkstationAssetTags: (assetTags: string[]) => void

    runSearch: (query?: string, options?: SearchOptions) => Promise<void>

    addErrorAlert: (title: string, description: string) => void
}

export function useEmployeeAssignActions({
                                             viewedEntity,
                                             setViewedEntity,

                                             draftNewEmployee,
                                             setDraftNewEmployee,

                                             draftEditEmployee,
                                             setDraftEditEmployee,

                                             isAddNewEmployeeModalOpen,
                                             openCloseAddNewEmployeeModal,
                                             setIsEntityModalOpen,

                                             setSelectedFilterTags,

                                             setAssignMode,
                                             setAssignEmployeeOfficeNumber,
                                             setAssignEmployeeProgramAreaId,
                                             setAssignEmployeeWorkstationAssetTags,

                                             runSearch,

                                             addErrorAlert
                                         }: EmployeeAssignActionsProps) {
    /**
     * Give me the employee currently being edited, whether it already has a draft or is still the originally viewed employee.
     */
    const getCurrentEditEmployee = useCallback(() => {
        if (draftEditEmployee) return draftEditEmployee

        // we need this fallback since draftEditEmployee is undefined at the start when you first click on a
        // employee search result
        // In other words, no draft exists yet, so use the employee that was originally opened.
        if (viewedEntity?.type === "employee") return viewedEntity

        // defensive state
        return undefined
    }, [
        draftEditEmployee,
        viewedEntity,
    ])

    /**
     * This function takes a snapshot of employee form data before closing the modal.
     * For add new employee modal, we use the draftNewEmployee state
     * For edit employee modal, we use the draftEditEmployee state
     *
     * @param formData
     */
    const saveEmployeeFormData = useCallback((formData: FormData) => {

        // If we are NOT in Add New Employee mode, then we must be editing an existing employee.
        // So get the current edit employee draft.
        const editEmployee = !isAddNewEmployeeModalOpen
            ? getCurrentEditEmployee()
            : undefined

        // defensive check
        // If this is edit mode, but we somehow cannot find the employee being edited, stop.
        if (!isAddNewEmployeeModalOpen && !editEmployee) {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage and try again"
            )
            return
        }

        const existingWorkspaceRestrictionUIState = isAddNewEmployeeModalOpen
            ? {
                ui_workspace_restricted_program_area_id: draftNewEmployee?.ui_workspace_restricted_program_area_id
            }
            : {
                ui_workspace_restricted_program_area_id: editEmployee?.ui_workspace_restricted_program_area_id ??
                    editEmployee?.workspace?.restricted_program_area_id
            }

        const employeeSnapshot: EmployeeFormValues = {
            ...parseEmployeeFormData(formData),
            ...existingWorkspaceRestrictionUIState
        }

        if (isAddNewEmployeeModalOpen) {
            setDraftNewEmployee(employeeSnapshot);
            openCloseAddNewEmployeeModal(false, false)
            return
        }

        // defensive check
        if (!editEmployee) {
            addErrorAlert(
                "Error: Something went wrong.",
                "Please refresh the webpage and try again"
            )
            return
        }

        const nextEmployee = {
            ...editEmployee,
            ...employeeSnapshot,
        }
        // Preserve in-progress employee edits before leaving the modal for assign mode
        setDraftEditEmployee(nextEmployee)

        setIsEntityModalOpen(false);
    }, [
        isAddNewEmployeeModalOpen,
        getCurrentEditEmployee,
        addErrorAlert,
        draftNewEmployee,
        setDraftNewEmployee,
        openCloseAddNewEmployeeModal,
        setDraftEditEmployee,
        setIsEntityModalOpen,
    ])

    /**
     * Function does 3 things:
     * Setting the mode
     * setting the matching filter tag
     * running the right search
     * @param mode
     * @param formData
     * @param employeeOfficeNumber
     * @param employeeProgramAreaId
     * @param employeeWorkstationAssetTags
     */
    const enterAssignMode = useCallback(async (
        mode: AssignMode,
        formData: FormData,
        employeeOfficeNumber?: string,
        employeeProgramAreaId?: number,
        employeeWorkstationAssetTags?: string[]
    ) => {

        setAssignMode(mode);

        // passing mode as a parameter since setStates are async
        await runSearch(
            undefined,
            {
                modeOverride: mode,
                employeeOfficeNumber,
                employeeProgramAreaId,
                employeeWorkstationAssetTags
            }
        )

        setSelectedFilterTags(new Set([mode]));

        saveEmployeeFormData(formData);
    }, [
        setAssignMode,
        runSearch,
        setSelectedFilterTags,
        saveEmployeeFormData
    ])

    /** This function is called when the user clicks on "Assign Office/Workspace/Workstation" in the add new employee
     *  modal or the
     *  "Update Office/Workspace/Workstation" button in the add new employee modal or the edit employee modal.
     * @param mode
     * @param formData
     */
    const activateAssignMode = useCallback(async (mode: AssignMode, formData: FormData) => {

        if (mode === "office") {
            await enterAssignMode(mode, formData)
            return
        }

        if (mode === "workspace") {
            const employeeOfficeNumber = formData.get("officeNumber") as string;
            const rawEmployeeProgramAreaId = formData.get("programArea") as string;
            const employeeProgramAreaId = rawEmployeeProgramAreaId ? Number(rawEmployeeProgramAreaId) : undefined;

            if (!employeeOfficeNumber) {
                addErrorAlert(
                    "Error: Office required",
                    "Please assign an office before assigning a workspace"
                )
                return
            }

            if (employeeProgramAreaId == null || Number.isNaN(employeeProgramAreaId)) {
                addErrorAlert(
                    "Error: Program Area required",
                    "Please select a valid Program Area before assigning a workspace"
                )
                return
            }

            setAssignEmployeeOfficeNumber(employeeOfficeNumber)
            setAssignEmployeeProgramAreaId(employeeProgramAreaId)

            await enterAssignMode(
                mode,
                formData,
                employeeOfficeNumber,
                employeeProgramAreaId
            )
            return
        }

        if (mode === "workstation") {

            const employeeWorkstationAssetTags = formData
                .getAll("workstationAssetTags")
                .map(value => String(value))

            setAssignEmployeeWorkstationAssetTags(employeeWorkstationAssetTags)

            await enterAssignMode(
                mode,
                formData,
                undefined,
                undefined,
                employeeWorkstationAssetTags
            )
        }
    }, [
        enterAssignMode,
        addErrorAlert,
        setAssignEmployeeOfficeNumber,
        setAssignEmployeeProgramAreaId,
        setAssignEmployeeWorkstationAssetTags,
    ])

    const cancelAssignModeHandler = useCallback(() => {
        setAssignMode("none")

        if (draftNewEmployee) {
            openCloseAddNewEmployeeModal(true)
            return
        }

        if (draftEditEmployee?.type === "employee") {
            setViewedEntity(draftEditEmployee)
            setIsEntityModalOpen(true)
            return
        }

        // code should ideally never reach here
        // if it does, then something is wrong
        addErrorAlert(
            "Error: Something went wrong.",
            "Please refresh the webpage and try again"
        )

    }, [
        setAssignMode,
        draftNewEmployee,
        openCloseAddNewEmployeeModal,
        draftEditEmployee,
        setViewedEntity,
        setIsEntityModalOpen,
        addErrorAlert,
    ])

    const assignOfficeClickHandler = useCallback((assignedOfficeNumber: string) => {
        setAssignMode("none")

        if (draftNewEmployee) {
            // We are in add new employee modal

            const officeChanged = draftNewEmployee.office_number !== assignedOfficeNumber

            const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : draftNewEmployee.ui_workspace_number

            const nextWorkspaceRestrictedProgramAreaId: EmployeeFormValues["ui_workspace_restricted_program_area_id"] = officeChanged ? undefined : draftNewEmployee.ui_workspace_restricted_program_area_id

            setDraftNewEmployee({
                ...draftNewEmployee,
                office_number: assignedOfficeNumber,
                ui_workspace_number: nextWorkspaceNumber,
                ui_workspace_restricted_program_area_id: nextWorkspaceRestrictedProgramAreaId,
            })
            openCloseAddNewEmployeeModal(true)
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const officeChanged = editEmployee.office_number !== assignedOfficeNumber

                const nextWorkspaceNumber: EmployeeFormValues["ui_workspace_number"] = officeChanged ? undefined : editEmployee.ui_workspace_number

                const nextWorkspaceRestrictedProgramAreaId: EmployeeFormValues["ui_workspace_restricted_program_area_id"] = officeChanged ? undefined : editEmployee.ui_workspace_restricted_program_area_id

                const nextEmployee = {
                    ...editEmployee,
                    office_number: assignedOfficeNumber,
                    ui_workspace_number: nextWorkspaceNumber,
                    ui_workspace_restricted_program_area_id: nextWorkspaceRestrictedProgramAreaId,
                    workspace: officeChanged ? null : editEmployee.workspace
                }

                setDraftEditEmployee(nextEmployee)
                setViewedEntity(nextEmployee)

                setIsEntityModalOpen(true)
            }
        }
    }, [
        setAssignMode,
        draftNewEmployee,
        setDraftNewEmployee,
        openCloseAddNewEmployeeModal,
        getCurrentEditEmployee,
        setDraftEditEmployee,
        setViewedEntity,
        setIsEntityModalOpen
    ])

    const assignWorkspaceClickHandler = useCallback((assignedWorkspace: SelectedWorkspaceAssignment) => {
        setAssignMode("none")

        if (draftNewEmployee) {
            // We are in add new employee modal
            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workspace_number: assignedWorkspace.workspace_number,
                ui_workspace_restricted_program_area_id: assignedWorkspace.restricted_program_area_id
            })
            openCloseAddNewEmployeeModal(true)
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const nextEmployee = {
                    ...editEmployee,
                    ui_workspace_number: assignedWorkspace.workspace_number,
                    ui_workspace_restricted_program_area_id: assignedWorkspace.restricted_program_area_id
                }

                setDraftEditEmployee(nextEmployee)
                setViewedEntity(nextEmployee)

                setIsEntityModalOpen(true)
            }
        }
    },[
        setAssignMode,
        draftNewEmployee,
        setDraftNewEmployee,
        openCloseAddNewEmployeeModal,
        getCurrentEditEmployee,
        setDraftEditEmployee,
        setViewedEntity,
        setIsEntityModalOpen
    ])

    const assignWorkstationClickHandler = useCallback((assignedWorkstationAssetTag: string) => {
        setAssignMode("none")

        if (draftNewEmployee) {

            const currentAssetTags = draftNewEmployee.ui_workstation_asset_tags ?? []

            const nextAssetTags = Array.from(
                new Set([...currentAssetTags, assignedWorkstationAssetTag])
            )

            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workstation_asset_tags: nextAssetTags
            })

            openCloseAddNewEmployeeModal(true)
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const currentAssetTags = editEmployee.ui_workstation_asset_tags ??
                    editEmployee.workstations.map(
                        workstation => workstation.asset_tag
                    )

                const nextAssetTags = Array.from(
                    new Set([...currentAssetTags, assignedWorkstationAssetTag])
                )

                const nextEmployee = {
                    ...editEmployee,
                    ui_workstation_asset_tags: nextAssetTags
                }

                setDraftEditEmployee(nextEmployee)
                setViewedEntity(nextEmployee)

                setIsEntityModalOpen(true)
            }
        }
    },[
        setAssignMode,
        draftNewEmployee,
        setDraftNewEmployee,
        openCloseAddNewEmployeeModal,
        getCurrentEditEmployee,
        setDraftEditEmployee,
        setViewedEntity,
        setIsEntityModalOpen
    ])

    const removeWorkspaceClickHandler = useCallback(() => {
        if (draftNewEmployee) {
            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workspace_number: undefined,
                ui_workspace_restricted_program_area_id: undefined
            })
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const nextEmployee = {
                    ...editEmployee,
                    ui_workspace_number: undefined,
                    ui_workspace_restricted_program_area_id: undefined,
                    workspace: null
                }

                setDraftEditEmployee(nextEmployee)
            }
        }
    }, [
        draftNewEmployee,
        setDraftNewEmployee,
        getCurrentEditEmployee,
        setDraftEditEmployee
    ])

    const removeWorkstationClickHandler = useCallback((assetTag: string) => {
        if (draftNewEmployee) {

            const currentAssetTags = draftNewEmployee.ui_workstation_asset_tags ?? []

            setDraftNewEmployee({
                ...draftNewEmployee,
                ui_workstation_asset_tags: currentAssetTags.filter(
                    currentAssetTag => currentAssetTag !== assetTag
                )
            })
        } else {

            const editEmployee = getCurrentEditEmployee()

            if (editEmployee) {

                const currentAssetTags = editEmployee.ui_workstation_asset_tags ??
                    editEmployee.workstations.map(
                        workstation => workstation.asset_tag
                    )

                const nextEmployee = {
                    ...editEmployee,
                    ui_workstation_asset_tags: currentAssetTags.filter(
                        currentAssetTag => currentAssetTag !== assetTag
                    )
                }

                setDraftEditEmployee(nextEmployee)
            }
        }
    }, [
        draftNewEmployee,
        setDraftNewEmployee,
        getCurrentEditEmployee,
        setDraftEditEmployee
    ])

    return {
        activateAssignMode,
        cancelAssignModeHandler,

        assignOfficeClickHandler,
        assignWorkspaceClickHandler,
        assignWorkstationClickHandler,

        removeWorkspaceClickHandler,
        removeWorkstationClickHandler
    }
}
