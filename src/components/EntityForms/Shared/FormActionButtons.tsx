import { Button, ButtonGroup } from "@bcgov/design-system-react-components";

interface FormActionButtonsProps {
  isEditMode: boolean;
  isPending: boolean;
  onClose: () => void;
  onDelete?: () => void;
  isDeleteDisabled?: boolean;
}

export function FormActionButtons({
  isEditMode,
  isPending,
  onClose,
  onDelete,
  isDeleteDisabled = false,
}: FormActionButtonsProps) {
  const deleteButton = (
    <Button
      size="large"
      variant="secondary"
      danger
      isDisabled={isDeleteDisabled || isPending}
      onPress={onDelete}
    >
      Delete
    </Button>
  );

  return (
    <div style={{ flex: "0 0 auto", width: "100%" }}>
      <ButtonGroup>
        {/* Only render the delete button in the edit modal */}
        {isEditMode && onDelete ? deleteButton : null}
        <ButtonGroup alignment="end">
          <Button size="large" variant="secondary" onPress={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="large" isDisabled={isPending}>
            {isEditMode ? "Save" : "Create"}
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}
