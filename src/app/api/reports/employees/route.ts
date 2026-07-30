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

    const normalizedQuery = query.trim().toLowerCase();
    const words = normalizedQuery.split(/\s+/).filter(Boolean);

    const whereClause: any = {
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
    };

    if (words.length >= 2) {
        whereClause.OR.push({
            AND: [
                {
                    first_name: {
                        contains: words[0],
                        mode: "insensitive",
                    },
                },
                {
                    last_name: {
                        contains: words[words.length - 1],
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    const employees = await prisma.employee.findMany({
        where: whereClause,
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
    }) as Array<{
        id: number;
        idir: string | null;
        first_name: string;
        alternate_name: string | null;
        last_name: string;
        employee_id: string | null;
        is_on_leave: boolean;
        notes: string | null;
        office_number: string;
        program_area_id: number;
        job_title_id: number | null;
        workspace_assignment_type_id: number | null;
        program_area?: {
            name: string | null;
            branch?: {
                name: string | null;
            } | null;
        } | null;
        job_title?: {
            name: string | null;
        } | null;
        assigned_office?: {
            office_number: string;
            office_name: string;
        } | null;
        workspace?: {
            office_number: string;
            workspace_number: string;
            is_on_hold: boolean;
            notes: string | null;
            category?: {
                name: string | null;
            } | null;
            desk_type?: {
                name: string | null;
            } | null;
        } | null;
        workstations?: Array<{
            asset_tag: string;
            notes: string | null;
            workstation_model?: {
                name: string | null;
            } | null;
        }> | null;
        mobile_device?: {
            imei: string | null;
            notes: string | null;
            mobile_device_model?: {
                name: string | null;
            } | null;
            current_office?: {
                office_number: string;
            } | null;
        } | null;
    }>;

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
        const workstations = employee.workstations ?? [];
        const workstationAssetTags = workstations.map((workstation) => workstation.asset_tag).join(" | ");
        const workstationModels = workstations.map((workstation) => workstation.workstation_model?.name ?? "").join(" | ");
        const workstationNotes = workstations.map((workstation) => workstation.notes ?? "").join(" | ");

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
