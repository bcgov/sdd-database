export const dynamic = "force-dynamic";

import {Workbook} from "exceljs";
import {prisma} from "@/db/client";
import {Prisma} from "@/generated/prisma/client"
import {buildWorkspaceReportWhereClause} from "./workspaceReportFilters";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim();
    const availability = body?.availability?.toString()?.trim();
    const employeeIdPopulated = body?.employeeIdPopulated?.toString()?.trim();
    const isUnassignedReport = body?.mode === "unassigned";

    if (!officeCode && !availability && !isUnassignedReport) {
        return new Response(JSON.stringify({message: "Office code is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
        });
    }

    const whereClause = buildWorkspaceReportWhereClause({officeCode, availability, employeeIdPopulated, mode: isUnassignedReport ? "unassigned" : undefined});

    const workspaces = await prisma.workspace.findMany({
        where: whereClause,
        orderBy: {
            workspace_number: "asc",
        },
        include: {
            category: true,
            desk_type: true,
            assigned_employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    id: true,
                    employee_id: true,
                    idir: true,
                    is_on_leave: true,
                    notes: true,
                    program_area: {
                        select: {
                            name: true,
                            branch: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    },
                    job_title: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        }
    });

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Workspaces");

    sheet.addRow([
        "Office Number",
        "Workspace Number",
        "Category",
        "Desk Type",
        "Available",
        "Hold Status",
        "Assigned Employee",
        "Employee IDIR",
        "Employee ID",
        "Employee Branch",
        "Employee Program Area",
        "Employee Job Title",
        "Employee Leave Status",
        "Employee Notes"
    ]);

    workspaces.forEach((workspace) => {
        const employee = workspace.assigned_employee;

        sheet.addRow([
            workspace.office_number,
            workspace.workspace_number,
            workspace.category?.name ?? "",
            workspace.desk_type?.name ?? "",
            workspace.employee_id === null ? "Yes" : "No",
            workspace.is_on_hold ? "On Hold" : "Not On Hold",
            employee ? `${employee.first_name} ${employee.last_name}` : "",
            employee?.idir ?? "",
            employee?.employee_id ?? "",
            employee?.program_area?.branch?.name ?? "",
            employee?.program_area?.name ?? "",
            employee?.job_title?.name ?? "",
            employee?.is_on_leave ? "Yes" : "No",
            employee?.notes ?? ""
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const filenameBase = officeCode || "all";

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="workspaces-${filenameBase}.xlsx"`
        }
    });
}
