import {MobileDeviceSearchResult} from "@/types";
import {addNewMobileDeviceAction, updateMobileDeviceAction} from "@/actions/entities/mobile-device/actions";
import {AccordionGroup, Form} from "@bcgov/design-system-react-components";
import {MobileDeviceDetails} from "@/components/EntityForms/MobileDevice/MobileDeviceDetails";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";
import {useMobileDeviceLookupProps} from "@/components/EntityForms/MobileDevice/useMobileDeviceLookupProps";
import {AssignedEmployeeDetails} from "@/components/EntityForms/Shared/AssignedEmployeeDetails";
import {FormActionButtons} from "@/components/EntityForms/Shared/FormActionButtons";


interface MobileDeviceFormProps {
    mobileDevice?: MobileDeviceSearchResult

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

    const hasAssignedEmployee = !!mobileDevice?.assigned_employee

    return (
        <Form action={formAction}>

            {/* pass mobile device id through FormData in edit mode */}
            {isEditMode && mobileDevice?.id !== undefined
                ? (<input type="hidden" name="id" value={mobileDevice.id}/>)
                : null
            }

            <AccordionGroup allowsMultipleExpanded
                            defaultExpandedKeys={
                                isEditMode
                                    ? ["mobileDeviceDetails", "assignedEmployeeDetails"]
                                    : ["mobileDeviceDetails"]
                            }
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem"
                            }}
            >
                <MobileDeviceDetails mobileDevice={mobileDevice}
                                     {...mobileDeviceLookupProps}
                                     isEditMode={isEditMode}
                                     isOfficeNumberReadOnly={isEditMode && hasAssignedEmployee}
                >
                </MobileDeviceDetails>

                {mobileDevice?.assigned_employee &&
                    <AssignedEmployeeDetails assignedEmployee={mobileDevice.assigned_employee}/>}

            </AccordionGroup>

            <FormActionButtons isEditMode={isEditMode}
                               isPending={isPending}
                               onClose={onClose}
            >
            </FormActionButtons>
        </Form>
    )
}
