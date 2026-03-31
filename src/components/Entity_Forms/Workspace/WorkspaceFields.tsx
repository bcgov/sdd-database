import {Accordion, AccordionGroup, TextField} from "@bcgov/design-system-react-components";

import {WorkspaceSearchResult} from "@/types";


interface WorkspaceFieldsProps {
    workspace: WorkspaceSearchResult;
}

export function WorkspaceFields({workspace}: WorkspaceFieldsProps) {
    const hasAssignedEmployee = !!workspace.assigned_employee

    return (
        <AccordionGroup allowsMultipleExpanded
                        defaultExpandedKeys={["workspaceDetails", "assignedEmployeeDetails"]}
                        style={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                        }}>

            <Accordion label="Workspace Details" id="workspaceDetails">
                <div>
                    <TextField
                        label="Workspace Number"
                        name="number"
                        isReadOnly
                        defaultValue={workspace.workspace_number}
                    >
                    </TextField>

                    <TextField
                        label="Office Number"
                        name="officeNumber"
                        isReadOnly
                        defaultValue={workspace.office_number}>
                    </TextField>
                </div>
            </Accordion>

            {hasAssignedEmployee && (
                <Accordion label="Assigned Employee Details" id="assignedEmployeeDetails">
                <div>
                    <TextField
                        label="First Name"
                        name="firstName"
                        isReadOnly
                        defaultValue={workspace.assigned_employee?.first_name}
                    >
                    </TextField>

                    <TextField
                        label="Last Name"
                        name="lastName"
                        isReadOnly
                        defaultValue={workspace.assigned_employee?.last_name}
                    >
                    </TextField>

                    <TextField
                        label="Alternate Name"
                        name="alternateName"
                        isReadOnly
                        defaultValue={workspace.assigned_employee?.alternate_name ?? ""}
                    >
                    </TextField>

                    <TextField
                        label="IDIR"
                        name="idir"
                        isReadOnly
                        defaultValue={workspace.assigned_employee?.idir ?? ""}
                    >
                    </TextField>
                </div>
            </Accordion>)}
        </AccordionGroup>
    )
}