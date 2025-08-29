import {Employee, Office, Workstation} from "@prisma/client";

// discriminated union
export type Entity =
    | (Employee & { type: "employee" })
    | (Office & { type: "office" })
    | (Workstation & { type: "workstation" })

export type EntityActionResult =
    | { status: "idle" }                    // before the first submit i.e. initial state
    | { status: "ok" }                      // server-side validation passed and entity action is successful
    | { status: "error"; error: string };   // server-side validation failed or an error occurred while processing the action
