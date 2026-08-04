import { AssignMode } from "@/types";
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
import type { PressEvent } from "@react-types/shared";
import { MobilePlanAssignmentDetails } from "@/components/EntityForms/MobileDevice/MobilePlanAssignmentDetails";
import type { MobileDeviceLike } from "@/components/EntityForms/MobileDevice/types";
import { ModalContentLayout } from "@/components/ModalContentLayout";

interface MobileDeviceFormProps {
  mobileDevice: MobileDeviceLike;
  isAssignmentPreview?: boolean;

  activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>;
  handleRemoveMobilePlan: () => void;

  onSuccess: () => void;
  onError: (error: string) => void;

  onClose: () => void;
}

export function MobileDeviceForm({
  mobileDevice,
  isAssignmentPreview = false,

  activateAssignMode,
  handleRemoveMobilePlan,

  onSuccess,
  onError,

  onClose,
}: MobileDeviceFormProps) {
  const isEditMode = mobileDevice?.id !== undefined;

  const serverAction = isEditMode
    ? updateMobileDeviceAction
    : addNewMobileDeviceAction;

  const { formAction, isPending } = useEntityFormActionState({
    serverAction,
    onSuccess,
    onError,
  });

  const mobileDeviceLookupProps = useMobileDeviceLookupProps();

  const hasAssignedEmployee =
    mobileDevice !== undefined &&
    "assigned_employee" in mobileDevice &&
    !!mobileDevice.assigned_employee;

  const mobileDeviceStatus: MobileDeviceStatus =
    mobileDevice && "ui_mobile_device_status" in mobileDevice
      ? (mobileDevice.ui_mobile_device_status as MobileDeviceStatus)
      : mobileDevice
        ? getMobileDeviceStatus(mobileDevice)
        : "unassigned";

  const assignedEmployee =
    mobileDevice && "assigned_employee" in mobileDevice
      ? mobileDevice.assigned_employee
      : null;

  const handleAssignMobilePlan = async (event: PressEvent) => {
    const formElement = event.target.closest("form");

    if (formElement) {
      await activateAssignMode("mobilePlan", new FormData(formElement));
    }
  };

  return (
    <Form
      action={formAction}
      style={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        minHeight: 0,
        overflow: "clip",
      }}
    >
      {/* pass mobile device id through FormData in edit mode */}
      {isEditMode && mobileDevice?.id !== undefined ? (
        <input type="hidden" name="id" value={mobileDevice.id} />
      ) : null}

      <ModalContentLayout
        footer={
          <FormActionButtons
            isEditMode={isEditMode}
            isPending={isPending}
            onClose={onClose}
          />
        }
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

          <MobilePlanAssignmentDetails
            mobileDevice={mobileDevice}
            isEditMode={isEditMode}
            isAssignmentPreview={isAssignmentPreview}
            handleAssignMobilePlan={handleAssignMobilePlan}
            handleRemoveMobilePlan={handleRemoveMobilePlan}
          ></MobilePlanAssignmentDetails>

          {assignedEmployee && (
            <AssignedEmployeeDetails
              assignedEmployee={assignedEmployee}
            />
          )}
        </AccordionGroup>
      </ModalContentLayout>
    </Form>
  );
}
