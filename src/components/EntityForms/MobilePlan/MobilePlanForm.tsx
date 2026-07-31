import {MobilePlanSearchResult} from "@/types";
import {AccordionGroup} from "@bcgov/design-system-react-components";
import {MobilePlanDetails} from "@/components/EntityForms/MobilePlan/MobilePlanDetails";
import {AssignedMobileDeviceDetails} from "@/components/EntityForms/Shared/AssignedMobileDeviceDetails";


interface MobilePlanFormProps {
    mobilePlan: MobilePlanSearchResult
}

export function MobilePlanForm({
                                   mobilePlan,
                               }: MobilePlanFormProps) {

    const assignedMobileDevice = mobilePlan.assigned_mobile_device

    return (
        <AccordionGroup allowsMultipleExpanded
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
            <MobilePlanDetails mobilePlan={mobilePlan}
                               isReadOnly
            >
            </MobilePlanDetails>

            {assignedMobileDevice && (
                <AssignedMobileDeviceDetails assignedMobileDevice={assignedMobileDevice}/>
            )
            }
        </AccordionGroup>
    )
}
