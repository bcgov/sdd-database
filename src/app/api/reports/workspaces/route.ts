import {Workbook} from "exceljs";
import {prisma} from "@/db/client";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim();

    if (!officeCode) {
        return new Response(JSON.stringify({message: "Office code is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
        });
    }

    const workspaces = await prisma.workspace.findMany({
        where: {
            office_number: officeCode,
        },
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
        "On Hold",
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
            workspace.is_on_hold ? "Yes" : "No",
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

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="workspaces-${officeCode}.xlsx"`
        }
    });
}
