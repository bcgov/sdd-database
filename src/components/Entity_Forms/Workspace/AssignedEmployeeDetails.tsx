import {WorkspaceSearchResult} from "@/types";
import {Accordion, TextField} from "@bcgov/design-system-react-components";


interface AssignedEmployeeDetailsProps {
    // only accepts a real assigned employee and WorkspaceForm guarantees that
    assignedEmployee: NonNullable<WorkspaceSearchResult["assigned_employee"]>
}

export function AssignedEmployeeDetails({
                                            assignedEmployee,
                                        }: AssignedEmployeeDetailsProps) {
    return (
        <Accordion label="Assigned Employee Details" id="assignedEmployeeDetails">
            <div>
                <TextField label="First Name"
                           name="firstName"
                           isReadOnly
                           defaultValue={assignedEmployee.first_name}
                >
                </TextField>

                <TextField label="Last Name"
                           name="lastName"
                           isReadOnly
                           defaultValue={assignedEmployee.last_name}
                >
                </TextField>

                <TextField label="Alternate Name"
                           name="alternateName"
                           isReadOnly
                           defaultValue={assignedEmployee.alternate_name ?? ""}
                >
                </TextField>

                <TextField label="IDIR"
                           name="idir"
                           isReadOnly
                           defaultValue={assignedEmployee.idir ?? ""}
                >
                </TextField>
            </div>
        </Accordion>
    )
}
