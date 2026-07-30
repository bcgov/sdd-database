import {Workbook} from "exceljs";
import {prisma} from "@/db/client";
import {Prisma} from "@/generated/prisma/client";

export async function POST(req: Request) {
    const body = await req.json();
    const assetTag = body?.assetTag?.toString()?.trim();
    const officeCode = body?.officeCode?.toString()?.trim();
    const modelName = body?.modelName?.toString()?.trim();

    if (assetTag) {
        const workstations = await prisma.workstation.findMany({
            where: {
                asset_tag: assetTag,
            },
            include: {
                workstation_model: {
                    select: {
                        name: true,
                    },
                },
                current_office: {
                    select: {
                        office_number: true,
                        office_name: true,
                    },
                },
                assigned_employee: {
                    select: {
                        first_name: true,
                        last_name: true,
                        idir: true,
                        employee_id: true,
                        notes: true,
                        program_area: {
                            select: {
                                name: true,
                                branch: {
                                    select: { name: true },
                                },
                            },
                        },
                        job_title: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        const workbook = new Workbook();
        const sheet = workbook.addWorksheet("Workstations");

        sheet.addRow([
            "Asset Tag",
            "Hardware",
            "Notes",
            "Refresh Assets",
            "Legacy Assets",
            "Office Code",
            "Office Name",
            "Employee Name",
            "Employee IDIR",
            "Employee ID",
            "Branch",
            "Program Area",
            "Job Title",
            "Employee Notes",
        ]);

        workstations.forEach((workstation) => {
            const employee = workstation.assigned_employee;

            sheet.addRow([
                workstation.asset_tag,
                workstation.workstation_model?.name ?? "",
                workstation.notes ?? "",
                "",
                "",
                workstation.current_office?.office_number ?? "",
                workstation.current_office?.office_name ?? "",
                employee ? `${employee.first_name} ${employee.last_name}` : "",
                employee?.idir ?? "",
                employee?.employee_id ?? "",
                employee?.program_area?.branch?.name ?? "",
                employee?.program_area?.name ?? "",
                employee?.job_title?.name ?? "",
                employee?.notes ?? "",
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="workstations-${assetTag}.xlsx"`
            }
        });
    }

    const whereClause: Prisma.WorkstationWhereInput = {};

    if (officeCode) {
        whereClause.office_number = officeCode;
    }

    if (modelName) {
        whereClause["workstation_model"] = {
            name: {
                contains: modelName,
                mode: "insensitive",
            },
        };
    }

    const workstations = await prisma.workstation.findMany({
        where: whereClause,
        include: {
            workstation_model: {
                select: {
                    name: true,
                },
            },
            current_office: {
                select: {
                    office_number: true,
                    office_name: true,
                },
            },
            assigned_employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    idir: true,
                    employee_id: true,
                    notes: true,
                    program_area: {
                        select: {
                            name: true,
                            branch: {
                                select: { name: true },
                            },
                        },
                    },
                    job_title: {
                        select: { name: true },
                    },
                },
            },
        },
    });

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Workstations");

    sheet.addRow([
        "Asset Tag",
        "Hardware",
        "Notes",
        "Refresh Assets",
        "Legacy Assets",
        "Office Code",
        "Office Name",
        "Employee Name",
        "Employee IDIR",
        "Employee ID",
        "Branch",
        "Program Area",
        "Job Title",
        "Employee Notes",
    ]);

    workstations.forEach((workstation) => {
        const employee = workstation.assigned_employee;

        sheet.addRow([
            workstation.asset_tag,
            workstation.workstation_model?.name ?? "",
            workstation.notes ?? "",
            "",
            "",
            workstation.current_office?.office_number ?? "",
            workstation.current_office?.office_name ?? "",
            employee ? `${employee.first_name} ${employee.last_name}` : "",
            employee?.idir ?? "",
            employee?.employee_id ?? "",
            employee?.program_area?.branch?.name ?? "",
            employee?.program_area?.name ?? "",
            employee?.job_title?.name ?? "",
            employee?.notes ?? "",
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const filenameBase = assetTag ? assetTag : ([officeCode, modelName].filter(Boolean).join("-") || "all");

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="workstations-${filenameBase}.xlsx"`
        }
    });
}
