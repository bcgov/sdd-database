import {EmployeeFormValues, Entity} from "@/types";


export const ENTITY_TYPE_NAME: Record<Entity["type"], string> = {
    employee: "Employee",
    office: "Office",
    workspace: "Workspace",
    workstation: "Workstation"
} as const;

export const parseEmployeeFormData = (formData: FormData): EmployeeFormValues => {

    const workspaceNumber = formData.get("workspaceNumber") as string;
    
    return {
        id: formData.get("id") ? Number(formData.get("id")) : undefined,
        office_number: formData.get("officeNumber") as string,
        idir: (formData.get("idir") as string).toUpperCase() || null,   // normalizing to maintain consistency in the DB
        first_name: formData.get("firstName") as string,
        alternate_name: formData.get("alternateName") as string || null,
        last_name: formData.get("lastName") as string,
        employee_id: (formData.get("employeeId") as string) || null,
        program_area_id: Number(formData.get("programArea")),
        notes: formData.get("notes") as string || null,
        ui_workspace_number: workspaceNumber !== "Unassigned" ? workspaceNumber : undefined,
    }
}

export const getEmployeeFullName = (employee: { first_name: string; last_name: string } | undefined) => {

    let fullName = "";

    if (employee) {

        fullName = `${employee.first_name} ${employee.last_name}`;
    }

    return fullName;
}
