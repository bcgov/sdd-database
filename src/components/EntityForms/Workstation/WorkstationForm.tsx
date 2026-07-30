import {
  AccordionGroup,
  Callout,
  Form,
} from "@bcgov/design-system-react-components";

import { WorkstationDetails } from "@/components/EntityForms/Workstation/WorkstationDetails";
import { WorkstationSearchResult } from "@/types";
import { AssignedEmployeeDetails } from "@/components/EntityForms/Shared/AssignedEmployeeDetails";
import { useWorkstationLookupProps } from "@/components/EntityForms/Workstation/useWorkstationLookupProps";
import {
  addNewWorkstationAction,
  updateWorkstationAction,
} from "@/actions/entities/workstation/actions";
import { useEntityFormActionState } from "@/hooks/entity/useEntityFormActionState";
import { FormActionButtons } from "@/components/EntityForms/Shared/FormActionButtons";

interface WorkstationFormProps {
  workstation?: WorkstationSearchResult;

  onSuccess: () => void;
  onError: (error: string) => void;

  onClose: () => void;
  onDelete?: () => void;
}

export function WorkstationForm({
  workstation,

  onSuccess,
  onError,

  onClose,
  onDelete,
}: WorkstationFormProps) {
  const isEditMode = !!workstation;

  const serverAction = isEditMode
    ? updateWorkstationAction
    : addNewWorkstationAction;

  const { formAction, isPending } = useEntityFormActionState({
    serverAction,
    onSuccess,
    onError,
  });

  const workstationLookupProps = useWorkstationLookupProps();

  const hasAssignedEmployee = !!workstation?.assigned_employee;

  return (
    <Form
      action={formAction}
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 8rem)",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        {hasAssignedEmployee && (
          <div style={{ marginTop: "1rem" }}>
            <Callout
              title="Info"
              description="Workstations can only be deleted when they are not assigned to an employee. To delete this workstation, open the assigned employee's modal and remove the workstation assignment."
            />
          </div>
        )}

        <AccordionGroup
          allowsMultipleExpanded
          defaultExpandedKeys={
            isEditMode
              ? ["workstationDetails", "assignedEmployeeDetails"]
              : ["workstationDetails"]
          }
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <WorkstationDetails
            workstation={workstation}
            {...workstationLookupProps}
            isAssetTagReadOnly={isEditMode}
            isModelReadOnly={isEditMode}
            isOfficeNumberReadOnly={isEditMode && hasAssignedEmployee}
            isNotesReadOnly={false}
          ></WorkstationDetails>

          {workstation?.assigned_employee && (
            <AssignedEmployeeDetails
              assignedEmployee={workstation.assigned_employee}
            />
          )}
        </AccordionGroup>
      </div>

      <FormActionButtons
        isEditMode={isEditMode}
        isPending={isPending}
        onClose={onClose}
        onDelete={onDelete}
        isDeleteDisabled={hasAssignedEmployee}
      ></FormActionButtons>
    </Form>
  );
}
