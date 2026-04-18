import {
    AccordionGroup,
} from "@bcgov/design-system-react-components";

import {WorkstationDetails} from "@/components/Entity_Forms/Workstation/WorkstationDetails";
import {WorkstationSearchResult} from "@/types";
import {AssignedEmployeeDetails} from "@/components/Entity_Forms/Shared/AssignedEmployeeDetails";


interface WorkstationFormProps {
    workstation: WorkstationSearchResult
}

export function WorkstationForm({workstation}: WorkstationFormProps) {

    return (
        <AccordionGroup allowsMultipleExpanded
                        defaultExpandedKeys={["workstationDetails", "assignedEmployeeDetails"]}
                        style={{
                            marginTop: "1rem",
                            marginBottom: "1rem"
                        }}>
            <WorkstationDetails workstation={workstation}></WorkstationDetails>

            {workstation.assigned_employee &&
                (<AssignedEmployeeDetails assignedEmployee={workstation.assigned_employee}/>)}
        </AccordionGroup>
    )
}
