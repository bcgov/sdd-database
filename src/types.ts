import type {Prisma, Office, Workstation} from "@/generated/prisma/client";


export type LookupOption = {
    id: number;
    name: string;
};

// employee form/draft state used by create/edit modals
export type EmployeeFormValues = {
    id?: number;
    office_number: string;
    idir: string | null;
    first_name: string;
    alternate_name: string | null;
    last_name: string;
    employee_id: string | null;
    program_area_id: number;
    notes: string | null;

    // UI-only branch cache so branch prefill survives modal close/open
    ui_branch_id?: number;
}

// employee returned from DB search results with hydrated program area
export type EmployeeSearchResult = Prisma.EmployeeGetPayload<{
    include: {program_area: true}
}>

type EmployeeEntity = EmployeeSearchResult & {
    ui_branch_id?: number;
};

// discriminated union
export type Entity =
    | (EmployeeEntity & { type: "employee" })
    | (Office & { type: "office" })
    | (Workstation & { type: "workstation" })

export type EntityActionResult =
    | { status: "idle" }                    // before the first submit i.e. initial state
    | { status: "ok" }                      // server-side validation passed and entity action is successful
    | { status: "error"; error: string };   // server-side validation failed or an error occurred while processing the action
