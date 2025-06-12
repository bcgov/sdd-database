import {Employee, Office, Workstation} from "@prisma/client";

// discriminated union
export type Entity =
    | (Employee & { type: "employee" })
    | (Office & { type: "office" })
    | (Workstation & { type: "workstation" })

export type EmployeeActionResult =
    | { status: "idle" }                    // before the first submit i.e. initial state
    | { status: "ok" }                      // server-side validation passed and employee added successfully
    | { status: "error"; error: string };   // server-side validation failed or an error occurred while adding employee
