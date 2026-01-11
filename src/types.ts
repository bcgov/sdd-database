import type {Prisma, Employee, ProgramArea, Office, Workstation} from "@/generated/prisma/client";


export type BranchOption = {
    id: number
    name: string
}

export type ProgramAreaOption = {
    id: number
    name: string
}

export type EmployeeFormState = Employee & {
    // present for hydrated employees (selectedSearchResult), absent for drafts (draftEmployee)
    program_area?: ProgramArea;

    // UI-only branch cache (so branch prefill survives modal close/open)
    ui_branch_id?: number;
}

// “Hydrated employee” (what comes from DB when we do include: { program_area: true })
type EmployeeWithProgramArea = Prisma.EmployeeGetPayload<{
    include: {program_area: true}
}>

type EmployeeEntity = EmployeeWithProgramArea & {
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
