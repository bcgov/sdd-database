import {Workbook} from "exceljs";
import {prisma} from "@/db/client";

export async function POST(req: Request) {
    const body = await req.json();
    const query = body?.query?.toString()?.trim();

    if (!query) {
        return new Response(JSON.stringify({message: "Name or IDIR is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
        });
    }

    const employees = await prisma.employee.findMany({
        where: {
            OR: [
                {
                    first_name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    last_name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    idir: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    employee_id: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    alternate_name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
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
            assigned_office: {
                select: {
                    office_number: true,
                    office_name: true,
                },
            },
            workspace: {
                select: {
                    office_number: true,
                    workspace_number: true,
                    is_on_hold: true,
                    notes: true,
                    category: {
                        select: { name: true },
                    },
                    desk_type: {
                        select: { name: true },
                    },
                },
            },
            workstations: {
                select: {
                    asset_tag: true,
                    notes: true,
                    workstation_model: {
                        select: { name: true },
                    },
                },
            },
            mobile_device: {
                select: {
                    imei: true,
                    notes: true,
                    mobile_device_model: {
                        select: { name: true },
                    },
                    current_office: {
                        select: { office_number: true },
                    },
                },
            },
        },
        orderBy: {
            last_name: "asc",
        },
    });

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Employees");

    sheet.addRow([
        "First Name",
        "Alternate Name",
        "Last Name",
        "Employee ID",
        "IDIR",
        "Office Number",
        "Office Name",
        "Branch",
        "Program Area",
        "Job Title",
        "On Leave",
        "Workspace",
        "Workspace Category",
        "Workspace Desk Type",
        "Workspace Hold Status",
        "Workspace Notes",
        "Workstation Asset Tags",
        "Workstation Models",
        "Workstation Notes",
        "Mobile Device IMEI",
        "Mobile Device Model",
        "Mobile Device Notes",
        "Notes",
    ]);

    employees.forEach((employee) => {
        const workstationAssetTags = employee.workstations.map((workstation) => workstation.asset_tag).join(" | ");
        const workstationModels = employee.workstations.map((workstation) => workstation.workstation_model?.name ?? "").join(" | ");
        const workstationNotes = employee.workstations.map((workstation) => workstation.notes ?? "").join(" | ");

        sheet.addRow([
            employee.first_name,
            employee.alternate_name ?? "",
            employee.last_name,
            employee.employee_id ?? "",
            employee.idir ?? "",
            employee.assigned_office?.office_number ?? "",
            employee.assigned_office?.office_name ?? "",
            employee.program_area?.branch?.name ?? "",
            employee.program_area?.name ?? "",
            employee.job_title?.name ?? "",
            employee.is_on_leave ? "Yes" : "No",
            employee.workspace ? `${employee.workspace.office_number}-${employee.workspace.workspace_number}` : "",
            employee.workspace?.category?.name ?? "",
            employee.workspace?.desk_type?.name ?? "",
            employee.workspace?.is_on_hold ? "On Hold" : "Active",
            employee.workspace?.notes ?? "",
            workstationAssetTags,
            workstationModels,
            workstationNotes,
            employee.mobile_device?.imei ?? "",
            employee.mobile_device?.mobile_device_model?.name ?? "",
            employee.mobile_device?.notes ?? "",
            employee.notes ?? "",
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="employees-${query}.xlsx"`,
        },
    });
}
