import {TextField} from "@bcgov/design-system-react-components";
import type {Workspace} from "@/generated/prisma/client";


interface WorkspaceFieldsProps {
    workspace: Workspace;
}

export function WorkspaceFields({workspace}: WorkspaceFieldsProps) {
    return (
        <div>
            <TextField
                label="Number"
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

            <TextField
                label="Assigned Employee Internal ID"
                name="employeeId"
                isReadOnly
                defaultValue={workspace.employee_id?.toString() ?? "Unassigned"}
            >
            </TextField>
        </div>
    )
}