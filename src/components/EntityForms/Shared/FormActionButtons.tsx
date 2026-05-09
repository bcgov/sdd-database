import {Button, ButtonGroup} from "@bcgov/design-system-react-components";


interface FormActionButtonsProps {
    isEditMode: boolean
    isPending: boolean
    onClose: () => void
    onDelete?: () => void
}

export function FormActionButtons({
                                      isEditMode,
                                      isPending,
                                      onClose,
                                      onDelete
                                  }: FormActionButtonsProps) {
    return (
        <ButtonGroup>
            <Button type="submit"
                    size="large"
                    isDisabled={isPending}>
                {isEditMode ? "Save" : "Create"}
            </Button>
            <Button size="large"
                    variant="secondary"
                    onPress={onClose}>
                Cancel
            </Button>

            {/* Only render the delete button in the edit modal */}
            {isEditMode && onDelete ? (
                <ButtonGroup alignment="end">
                    <Button size="large"
                            variant="secondary"
                            danger
                            onPress={onDelete}>
                        Delete
                    </Button>
                </ButtonGroup>
            ) : null}
        </ButtonGroup>
    )
}
