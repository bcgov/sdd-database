import { MobileDeviceSearchResult } from "@/types";
import {
  addNewMobileDeviceAction,
  updateMobileDeviceAction,
} from "@/actions/entities/mobile-device/actions";
import { AccordionGroup, Form } from "@bcgov/design-system-react-components";
import { MobileDeviceDetails } from "@/components/EntityForms/MobileDevice/MobileDeviceDetails";
import { useEntityFormActionState } from "@/hooks/entity/useEntityFormActionState";
import { useMobileDeviceLookupProps } from "@/components/EntityForms/MobileDevice/useMobileDeviceLookupProps";
import { AssignedEmployeeDetails } from "@/components/EntityForms/Shared/AssignedEmployeeDetails";
import { FormActionButtons } from "@/components/EntityForms/Shared/FormActionButtons";
import { getMobileDeviceStatus } from "@/domain/mobileDevices";
import type { MobileDeviceStatus } from "@/domain/mobileDevices";
import { MobilePlanDetails } from "@/components/EntityForms/MobilePlan/MobilePlanDetails";

interface MobileDeviceFormProps {
  mobileDevice?: MobileDeviceSearchResult;

  onSuccess: () => void;
  onError: (error: string) => void;

  onClose: () => void;
}

export function MobileDeviceForm({
  mobileDevice,

  onSuccess,
  onError,

  onClose,
}: MobileDeviceFormProps) {
  const isEditMode = !!mobileDevice;

  const serverAction = isEditMode
    ? updateMobileDeviceAction
    : addNewMobileDeviceAction;

  const { formAction, isPending } = useEntityFormActionState({
    serverAction,
    onSuccess,
    onError,
  });

  const mobileDeviceLookupProps = useMobileDeviceLookupProps();

  const hasAssignedEmployee = !!mobileDevice?.assigned_employee;

  const mobileDeviceStatus: MobileDeviceStatus = mobileDevice
    ? getMobileDeviceStatus(mobileDevice)
    : "unassigned";

  return (
    <Form
      action={formAction}
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 8rem)",
      }}
    >
      {/* pass mobile device id through FormData in edit mode */}
      {isEditMode && mobileDevice?.id !== undefined ? (
        <input type="hidden" name="id" value={mobileDevice.id} />
      ) : null}

      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        <AccordionGroup
          allowsMultipleExpanded
          defaultExpandedKeys={["mobileDeviceDetails"]}
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <MobileDeviceDetails
            mobileDevice={mobileDevice}
            {...mobileDeviceLookupProps}
            isOfficeNumberReadOnly={isEditMode && hasAssignedEmployee}
            mobileDeviceStatus={mobileDeviceStatus}
          ></MobileDeviceDetails>

          {mobileDevice?.mobile_plan && (
            <MobilePlanDetails
              mobilePlan={mobileDevice.mobile_plan}
              isReadOnly
              showStatus={false}
              showEnhancedVoicemail={false}
            ></MobilePlanDetails>
          )}

          {mobileDevice?.assigned_employee && (
            <AssignedEmployeeDetails
              assignedEmployee={mobileDevice.assigned_employee}
            />
          )}
        </AccordionGroup>
      </div>

      <FormActionButtons
        isEditMode={isEditMode}
        isPending={isPending}
        onClose={onClose}
      ></FormActionButtons>
    </Form>
  );
}
