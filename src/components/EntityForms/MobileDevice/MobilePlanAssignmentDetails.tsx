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
  handleAssignMobilePlan: (event: PressEvent) => Promise<void>;
  handleRemoveMobilePlan: () => void;
}

export function MobilePlanAssignmentDetails({
  mobileDevice,
  isEditMode,
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
          description={`Click ${hasMobilePlanAssignment ? "Update" : "Assign"} Mobile Plan to choose an active, unassigned plan. The selection will be linked only when you click ${isEditMode ? "Save" : "Create"} below.`}
        ></Callout>

        <TextField label="Mobile Plan" isReadOnly value={mobilePlanTitle}></TextField>

        <input type="hidden" name="mobilePlanId" value={mobilePlanId ?? ""} />
        <input type="hidden" name="mobilePlanTitle" value={mobilePlanTitle === "Unassigned" ? "" : mobilePlanTitle} />

        <AssignmentActionRow>
          <Button
            type="button"
            variant="secondary"
            onPress={handleAssignMobilePlan}
          >
            {hasMobilePlanAssignment ? "Update" : "Assign"} Mobile Plan
          </Button>

          {hasMobilePlanAssignment && (
            <Button
              type="button"
              variant="secondary"
              danger
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
