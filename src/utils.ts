import {Employee} from "@prisma/client";
// import {Employee, Office} from "@prisma/client";

export const getEmployeeFullName = (employee: Employee | undefined) => {

    let fullName = "";

    if (employee) {
        fullName = `${employee.first_name} ${employee.middle_name ?? ""} ${employee.last_name}`;
    }

    return fullName;
}

// export function isEmployee(item: Employee | Office) {
//
// }