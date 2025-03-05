import {Employee, Office} from "@prisma/client";

// discriminated union
export type Entity =
    | (Employee & { type: "employee" })
    | (Office & { type: "office" })
