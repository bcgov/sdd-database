import {useEffect, useRef} from "react";

import {PressEvent} from "@react-types/shared";

import {
    AccordionGroup,
    Form,
} from "@bcgov/design-system-react-components";

import {AssignMode} from "@/types";

import {WorkspaceDetails} from "@/components/EntityForms/Employee/WorkspaceDetails";
import {OfficeDetails} from "@/components/EntityForms/Employee/OfficeDetails";
import {useEmployeeLookupState} from "@/components/EntityForms/Employee/useEmployeeLookupState";
import {OhsAccommodations} from "@/components/EntityForms/Employee/OhsAccommodations";
import {EmployeeDetails} from "@/components/EntityForms/Employee/EmployeeDetails";
import {WorkstationDetails} from "@/components/EntityForms/Employee/WorkstationDetails";
import {getEmployeeAssignmentState} from "@/components/EntityForms/Employee/getEmployeeAssignmentState";
import {EmployeeLike} from "@/components/EntityForms/Employee/types";
import {addNewEmployeeAction, updateEmployeeAction} from "@/actions/entities/employee/actions";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";
import {MobileDeviceDetails} from "@/components/EntityForms/Employee/MobileDeviceDetails";
import {FormActionButtons} from "@/components/EntityForms/Shared/FormActionButtons";


interface EmployeeFormProps {
    employee: EmployeeLike

    activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>

    handleRemoveWorkspace: () => void
    handleRemoveWorkstation: (assetTag: string) => void
    handleRemoveMobileDevice: () => void

    onSuccess: () => void
    onError: (error: string) => void
    // optional prop only passed in edit mode
    onDelete?: () => void
    onClose: () => void
}

export function EmployeeForm({
                                 employee,

                                 activateAssignMode,

                                 handleRemoveWorkspace,
                                 handleRemoveWorkstation,
                                 handleRemoveMobileDevice,

                                 onSuccess,
                                 onError,
                                 onDelete,
                                 onClose
                             }: EmployeeFormProps) {

    const isEditMode = !!onDelete;

    const serverAction = isEditMode ? updateEmployeeAction : addNewEmployeeAction

    const {formAction, isPending} = useEntityFormActionState({
        serverAction,
        onSuccess,
        onError
    })

    const employeeLookupState = useEmployeeLookupState(employee)

    const previousBranchIdRef = useRef<number | null>(employeeLookupState.selectedBranchId)
    const previousProgramAreaIdRef = useRef<number | null>(employeeLookupState.selectedProgramAreaId)

    const hasProgramAreaAssignment = !!employeeLookupState.selectedProgramAreaId

    const {
        hasOfficeAssignment,
        officeNumber,

        hasWorkspaceAssignment,
        workspaceNumber,
        selectedWorkspaceRestrictedProgramAreaId,

        workstationAssetTags,

        hasMobileDeviceAssignment,
        mobileDeviceId,
        mobileDeviceTitle
    } = getEmployeeAssignmentState(employee)

    useEffect(() => {
        const previousBranchId = previousBranchIdRef.current
        const previousProgramAreaId = previousProgramAreaIdRef.current

        const currentBranchId = employeeLookupState.selectedBranchId
        const currentProgramAreaId = employeeLookupState.selectedProgramAreaId

        const branchChanged = previousBranchId !== currentBranchId
        const programAreaChanged = previousProgramAreaId !== currentProgramAreaId

        if (hasWorkspaceAssignment) {
            if (branchChanged) {
                handleRemoveWorkspace()
            } else {
                if (programAreaChanged) {
                    const workspaceStillEligible =
                        // workspace is unrestricted (matches both null and undefined)
                        selectedWorkspaceRestrictedProgramAreaId == null ||
                        // workspace is restricted, but to the employee’s new program area
                        selectedWorkspaceRestrictedProgramAreaId === currentProgramAreaId

                    if (!workspaceStillEligible) {
                        handleRemoveWorkspace()
                    }
                }
            }
        }

        previousBranchIdRef.current = currentBranchId;
        previousProgramAreaIdRef.current = currentProgramAreaId;
    }, [
        employeeLookupState.selectedBranchId,
        employeeLookupState.selectedProgramAreaId,
        hasWorkspaceAssignment,
        selectedWorkspaceRestrictedProgramAreaId,
        handleRemoveWorkspace
    ])

    const handleAssign = async (mode: AssignMode, e: PressEvent) => {
        const formElement = e.target.closest("form")

        if (formElement) {
            await activateAssignMode(mode, new FormData(formElement))
        }
    }

    return (
        <Form action={formAction}
              style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // gap: '0.5rem',
              }}>

            {/* pass employee.id through FormData in edit mode */}
            {isEditMode && employee?.id !== undefined
                ? (<input type="hidden" name="id" value={employee.id}/>)
                : null
            }

            <div
                style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                    paddingRight: "0.5rem",
                }}
            >
                <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={["employeeDetails"]} style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}>

                    <EmployeeDetails employee={employee}
                                     lookupState={employeeLookupState}
                                     isEditMode={isEditMode}>
                    </EmployeeDetails>

                    <OfficeDetails officeNumber={officeNumber}
                                   hasOfficeAssignment={hasOfficeAssignment}
                                   isEditMode={isEditMode}
                                   handleAssignOffice={(e) => handleAssign("office", e)}>
                    </OfficeDetails>

                    <WorkspaceDetails workspaceAssignmentTypes={employeeLookupState.workspaceAssignmentTypes}
                                      selectedWorkspaceAssignmentTypeId={employeeLookupState.selectedWorkspaceAssignmentTypeId}
                                      setSelectedWorkspaceAssignmentTypeId={employeeLookupState.setSelectedWorkspaceAssignmentTypeId}

                                      workspaceNumber={workspaceNumber}
                                      hasProgramAreaAssignment={hasProgramAreaAssignment}
                                      hasOfficeAssignment={hasOfficeAssignment}
                                      hasWorkspaceAssignment={hasWorkspaceAssignment}
                                      handleAssignWorkspace={(e) => handleAssign("workspace", e)}
                                      handleRemoveWorkspace={handleRemoveWorkspace}>
                    </WorkspaceDetails>

                    <WorkstationDetails workstationAssetTags={workstationAssetTags}
                                        handleAssignWorkstation={(e) => handleAssign("workstation", e)}
                                        handleRemoveWorkstation={handleRemoveWorkstation}>
                    </WorkstationDetails>

                    <MobileDeviceDetails mobileDeviceId={mobileDeviceId}
                                         mobileDeviceTitle={mobileDeviceTitle}

                                         hasMobileDeviceAssignment={hasMobileDeviceAssignment}
                                         handleAssignMobileDevice={(e) => handleAssign("mobileDevice", e)}
                                         handleRemoveMobileDevice={handleRemoveMobileDevice}
                    >
                    </MobileDeviceDetails>

                    <OhsAccommodations ohsAccommodationTypes={employeeLookupState.ohsAccommodationTypes}
                                       selectedOhsAccommodationTypeIds={employeeLookupState.selectedOhsAccommodationTypeIds}>
                    </OhsAccommodations>
                </AccordionGroup>
            </div>

            <FormActionButtons isEditMode={isEditMode}
                               isPending={isPending}
                               onClose={onClose}
                               onDelete={onDelete}
            >
            </FormActionButtons>

        </Form>
    )
}
