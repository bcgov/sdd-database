import {Employee, Office, Workstation} from "@prisma/client";

// discriminated union
export type Entity =
    | (Employee & { type: "employee" })
    | (Office & { type: "office" })
    | (Workstation & { type: "workstation" })
