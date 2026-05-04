import {MobileDeviceFormValues} from "@/types";
import {addNewMobileDeviceAction, updateMobileDeviceAction} from "@/actions/entities/mobile-device/actions";
import {AccordionGroup, Button, ButtonGroup, Form} from "@bcgov/design-system-react-components";
import {MobileDeviceDetails} from "@/components/EntityForms/MobileDevice/MobileDeviceDetails";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";


interface MobileDeviceFormProps {
    mobileDevice?: MobileDeviceFormValues

    onSuccess: () => void
    onError: (error: string) => void

    onClose: () => void
}

export function MobileDeviceForm({
                                     mobileDevice,

                                     onSuccess,
                                     onError,

                                     onClose,
                                 }: MobileDeviceFormProps) {

    const isEditMode = !!mobileDevice

    const serverAction = isEditMode
        ? updateMobileDeviceAction
        : addNewMobileDeviceAction

    const {formAction, isPending} = useEntityFormActionState({
        serverAction,
        onSuccess,
        onError
    })

    return (
        <Form action={formAction}>
            <AccordionGroup allowsMultipleExpanded
                            defaultExpandedKeys={["mobileDeviceDetails"]}
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem"
                            }}
            >
                <MobileDeviceDetails mobileDevice={mobileDevice}
                                     isEditMode={isEditMode}
                >
                </MobileDeviceDetails>

            </AccordionGroup>

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
            </ButtonGroup>
        </Form>
    )
}
