import {MobileDeviceFormValues} from "@/types";
import {addNewMobileDeviceAction, updateMobileDeviceAction} from "@/actions/entities/mobile-device/actions";
import {AccordionGroup, Button, ButtonGroup, Form} from "@bcgov/design-system-react-components";
import {MobileDeviceDetails} from "@/components/EntityForms/MobileDevice/MobileDeviceDetails";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";
import {useMobileDeviceLookupProps} from "@/components/EntityForms/MobileDevice/useMobileDeviceLookupProps";


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

    const mobileDeviceLookupProps = useMobileDeviceLookupProps()

    return (
        <Form action={formAction}>

            {/* pass mobile device id through FormData in edit mode */}
            {isEditMode && mobileDevice?.id !== undefined
                ? (<input type="hidden" name="id" value={mobileDevice.id}/>)
                : null
            }

            <AccordionGroup allowsMultipleExpanded
                            defaultExpandedKeys={["mobileDeviceDetails"]}
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem"
                            }}
            >
                <MobileDeviceDetails mobileDevice={mobileDevice}
                                     {...mobileDeviceLookupProps}
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
