import { Accordion, Button, Callout, TextField } from "@bcgov/design-system-react-components";
import type { PressEvent } from "@react-types/shared";
import type { MobileDeviceLike } from "@/components/EntityForms/MobileDevice/types";
import { getMobileDevicePlanAssignmentState } from "@/components/EntityForms/MobileDevice/getMobileDevicePlanAssignmentState";
import {
  AssignmentActionRow,
  AssignmentSectionContent,
} from "@/components/EntityForms/Shared/AssignmentSectionLayout";

interface MobilePlanAssignmentDetailsProps {
  mobileDevice: MobileDeviceLike;
  isEditMode: boolean;
  isAssignmentPreview: boolean;
  handleAssignMobilePlan: (event: PressEvent) => Promise<void>;
  handleRemoveMobilePlan: () => void;
}

export function MobilePlanAssignmentDetails({
  mobileDevice,
  isEditMode,
  isAssignmentPreview,
  handleAssignMobilePlan,
  handleRemoveMobilePlan,
}: MobilePlanAssignmentDetailsProps) {
  const {
    hasMobilePlanAssignment,
    mobilePlanId,
    mobilePlanTitle,
  } = getMobileDevicePlanAssignmentState(mobileDevice);

  return (
    <Accordion label="Mobile Plan Details" id="mobilePlanDetails">
      <AssignmentSectionContent>
        <Callout
          description={
            isAssignmentPreview
              ? "Mobile Plan assignment is unavailable while selecting a Mobile Device for an employee. Assign the device and save the employee first, then open the Mobile Device normally to manage its plan."
              : `Click ${hasMobilePlanAssignment ? "Update" : "Assign"} Mobile Plan to choose an active, unassigned plan. The selection will be linked only when you click ${isEditMode ? "Save" : "Create"} below.`
          }
        ></Callout>

        <TextField label="Mobile Plan" isReadOnly value={mobilePlanTitle}></TextField>

        <input type="hidden" name="mobilePlanId" value={mobilePlanId ?? ""} />
        <input type="hidden" name="mobilePlanTitle" value={mobilePlanTitle === "Unassigned" ? "" : mobilePlanTitle} />

        <AssignmentActionRow>
          <Button
            type="button"
            variant="secondary"
            isDisabled={isAssignmentPreview}
            onPress={handleAssignMobilePlan}
          >
            {hasMobilePlanAssignment ? "Update" : "Assign"} Mobile Plan
          </Button>

          {hasMobilePlanAssignment && (
            <Button
              type="button"
              variant="secondary"
              danger
              isDisabled={isAssignmentPreview}
              onPress={handleRemoveMobilePlan}
            >
              Remove Mobile Plan
            </Button>
          )}
        </AssignmentActionRow>
      </AssignmentSectionContent>
    </Accordion>
  );
}
