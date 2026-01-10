import {Employee} from "@prisma/client";

import {Entity} from "@/types";


export const ENTITY_TYPE_NAME: Record<Entity["type"], string> = {
    employee: "Employee",
    office: "Office",
    workstation: "Workstation"
} as const;

export const parseEmployeeFormData = (formData: FormData): Employee => {
    return {
        office_number: formData.get("officeNumber") as string,
        idir: formData.get("idir") as string,
        first_name: formData.get("firstName") as string,
        alternate_name: formData.get("alternateName") as string || null,
        last_name: formData.get("lastName") as string,
        employee_id: formData.get("employeeId") as string,
        program_area_id: Number(formData.get("programArea")),
        notes: formData.get("notes") as string || null,
    }
}

export const getEmployeeFullName = (employee: Employee | undefined) => {

    let fullName = "";

    if (employee) {

        fullName = `${employee.first_name} ${employee.last_name}`;
    }

    return fullName;
}
