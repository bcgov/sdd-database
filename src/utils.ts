import {Employee} from "@prisma/client";
import {Entity} from "@/types/Entity";

export const getEmployeeFullName = (employee: Employee | undefined) => {

    let fullName = "";

    if (employee) {

        fullName = `${employee.first_name} ${employee.last_name}`;
    }

    return fullName;
}

export const ENTITY_TYPE_NAME: Record<Entity["type"], string> = {
    employee: "Employee",
    office: "Office",
    workstation: "Workstation"
} as const;
