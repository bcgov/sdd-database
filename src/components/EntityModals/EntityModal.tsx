import { AssignMode, EmployeeEntity, Entity, MobileDeviceEntity } from "@/types";
import { EmployeeModal } from "@/components/EntityModals/EmployeeModal";
import { OfficeModal } from "@/components/EntityModals/OfficeModal";
import { WorkspaceModal } from "@/components/EntityModals/WorkspaceModal";
import { WorkstationModal } from "@/components/EntityModals/WorkstationModal";
import { MobileDeviceModal } from "@/components/EntityModals/MobileDeviceModal";
import { MobilePlanModal } from "@/components/EntityModals/MobilePlanModal";

interface EntityModalProps {
  viewedEntity: Entity;
  draftEditEmployee?: EmployeeEntity;
  draftEditMobileDevice?: MobileDeviceEntity;
  isMobileDeviceAssignmentPreview: boolean;

  activateAssignMode: (mode: AssignMode, formData: FormData) => Promise<void>;

  handleRemoveWorkspace: () => void;
  handleRemoveWorkstation: (assetTag: string) => void;
  handleRemoveMobileDevice: () => void;

  activateMobilePlanAssignMode: (
    mode: AssignMode,
    formData: FormData,
  ) => Promise<void>;
  handleRemoveMobilePlan: () => void;
  clearDraftEditMobileDevice: () => void;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  onSuccess: () => void;
  onError: (error: string) => void;
  onDelete: () => void;
}

export function EntityModal({
  viewedEntity,
  draftEditEmployee,
  draftEditMobileDevice,
  isMobileDeviceAssignmentPreview,

  activateAssignMode,

  handleRemoveWorkspace,
  handleRemoveWorkstation,
  handleRemoveMobileDevice,

  activateMobilePlanAssignMode,
  handleRemoveMobilePlan,
  clearDraftEditMobileDevice,

  isOpen,
  setIsOpen,

  onSuccess,
  onError,
  onDelete,
}: EntityModalProps) {
  switch (viewedEntity.type) {
    case "employee":
      return (
        <EmployeeModal
          employee={draftEditEmployee ?? viewedEntity}
          activateAssignMode={activateAssignMode}
          handleRemoveWorkspace={handleRemoveWorkspace}
          handleRemoveWorkstation={handleRemoveWorkstation}
          handleRemoveMobileDevice={handleRemoveMobileDevice}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={onSuccess}
          onError={onError}
          onDelete={onDelete}
        ></EmployeeModal>
      );

    case "office":
      return (
        <OfficeModal
          office={viewedEntity}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        ></OfficeModal>
      );

    case "workspace":
      return (
        <WorkspaceModal
          workspace={viewedEntity}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={onSuccess}
          onError={onError}
        ></WorkspaceModal>
      );
    case "workstation":
      return (
        <WorkstationModal
          workstation={viewedEntity}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={onSuccess}
          onError={onError}
          onDelete={onDelete}
        ></WorkstationModal>
      );
    case "mobileDevice":
      return (
        <MobileDeviceModal
          mobileDevice={draftEditMobileDevice ?? viewedEntity}
          isAssignmentPreview={isMobileDeviceAssignmentPreview}
          activateAssignMode={activateMobilePlanAssignMode}
          handleRemoveMobilePlan={handleRemoveMobilePlan}
          clearDraftEditMobileDevice={clearDraftEditMobileDevice}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={onSuccess}
          onError={onError}
        ></MobileDeviceModal>
      );
    case "mobilePlan":
      return (
        <MobilePlanModal
          mobilePlan={viewedEntity}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={onSuccess}
          onError={onError}
        ></MobilePlanModal>
      );
  }
}
