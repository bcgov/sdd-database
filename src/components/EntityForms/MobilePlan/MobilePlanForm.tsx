import { MobilePlanSearchResult } from "@/types";
import { AccordionGroup, Form } from "@bcgov/design-system-react-components";
import { MobilePlanDetails } from "@/components/EntityForms/MobilePlan/MobilePlanDetails";
import { AssignedMobileDeviceDetails } from "@/components/EntityForms/Shared/AssignedMobileDeviceDetails";
import { updateMobilePlanAction } from "@/actions/entities/mobile-plan/actions";
import { useEntityFormActionState } from "@/hooks/entity/useEntityFormActionState";
import { useMobilePlanLookupProps } from "@/components/EntityForms/MobilePlan/useMobilePlanLookupProps";
import { FormActionButtons } from "@/components/EntityForms/Shared/FormActionButtons";
import { ModalContentLayout } from "@/components/ModalContentLayout";

interface MobilePlanFormProps {
  mobilePlan: MobilePlanSearchResult;

  onSuccess: () => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export function MobilePlanForm({
  mobilePlan,
  onSuccess,
  onError,
  onClose,
}: MobilePlanFormProps) {
  const assignedMobileDevice = mobilePlan.assigned_mobile_device;
  const { formAction, isPending } = useEntityFormActionState({
    serverAction: updateMobilePlanAction,
    onSuccess,
    onError,
  });
  const mobilePlanLookupProps = useMobilePlanLookupProps();

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
      <input type="hidden" name="id" value={mobilePlan.id} />

      <ModalContentLayout
        footer={
          <FormActionButtons
            isEditMode
            isPending={isPending}
            onClose={onClose}
          />
        }
      >
        <AccordionGroup
          allowsMultipleExpanded
          defaultExpandedKeys={
            assignedMobileDevice
              ? ["mobilePlanDetails", "assignedMobileDeviceDetails"]
              : ["mobilePlanDetails"]
          }
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <MobilePlanDetails
            mobilePlan={mobilePlan}
            {...mobilePlanLookupProps}
            isReadOnly={false}
          ></MobilePlanDetails>

          {assignedMobileDevice && (
            <AssignedMobileDeviceDetails
              assignedMobileDevice={assignedMobileDevice}
            />
          )}
        </AccordionGroup>
      </ModalContentLayout>
    </Form>
  );
}
