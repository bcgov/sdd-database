import type {Prisma} from "@/generated/prisma/client";

export function buildWorkspaceReportWhereClause(body: unknown): Prisma.WorkspaceWhereInput {
    const officeCode = typeof body === "object" && body !== null && "officeCode" in body
        ? String((body as {officeCode?: unknown}).officeCode ?? "").trim()
        : "";
    const availability = typeof body === "object" && body !== null && "availability" in body
        ? String((body as {availability?: unknown}).availability ?? "").trim()
        : "";
    const employeeIdPopulated = typeof body === "object" && body !== null && "employeeIdPopulated" in body
        ? String((body as {employeeIdPopulated?: unknown}).employeeIdPopulated ?? "").trim()
        : "";
    const isUnassignedReport = typeof body === "object" && body !== null && "mode" in body
        ? (body as {mode?: unknown}).mode === "unassigned"
        : false;

    const clauses: Prisma.WorkspaceWhereInput[] = [];

    if (officeCode) {
        clauses.push({office_number: officeCode});
    }

    if (isUnassignedReport) {
        clauses.push({employee_id: null});
        clauses.push({restricted_program_area_id: null});

        if (availability === "free") {
            clauses.push({is_on_hold: false});
        } else if (availability === "onhold") {
            clauses.push({is_on_hold: true});
        }

        return clauses.length === 1 ? clauses[0] : {AND: clauses};
    }

    if (availability === "free") {
        clauses.push({employee_id: null});
    } else if (availability === "onhold") {
        clauses.push({is_on_hold: true});
    }

    if (employeeIdPopulated === "true") {
        clauses.push({employee_id: {not: null}});
    } else if (employeeIdPopulated === "false") {
        clauses.push({employee_id: null});
    }

    if (clauses.length === 0) {
        return {};
    }

    return clauses.length === 1 ? clauses[0] : {AND: clauses};
}
