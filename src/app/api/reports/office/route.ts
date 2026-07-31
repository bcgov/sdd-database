export const dynamic = "force-dynamic";

import {prisma} from "@/db/client";
import {createXlsxResponse} from "../xlsx";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim().toUpperCase();

    if (!officeCode) {
        return new Response(JSON.stringify({message: "Office code is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"},
        });
    }

    const office = await prisma.office.findUnique({
        where: {
            office_number: officeCode,
        },
        select: {
            office_number: true,
            office_name: true,
        },
    });

    if (!office) {
        return new Response(JSON.stringify({message: "Office not found"}), {
            status: 404,
            headers: {"Content-Type": "application/json"},
        });
    }

    const [employees, workspaces, workstations, mobileDevices] = await Promise.all([
        prisma.employee.findMany({
            where: {
                office_number: officeCode,
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
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                last_name: "asc",
            },
        }),
        prisma.workspace.findMany({
            where: {
                office_number: officeCode,
            },
            include: {
                category: {
                    select: { name: true },
                },
                desk_type: {
                    select: { name: true },
                },
                assigned_employee: {
                    select: {
                        first_name: true,
                        last_name: true,
                        employee_id: true,
                    },
                },
                restricted_program_area: {
                    select: { name: true },
                },
            },
            orderBy: [
                { office_number: "asc" },
                { workspace_number: "asc" },
            ],
        }),
        prisma.workstation.findMany({
            where: {
                office_number: officeCode,
            },
            include: {
                workstation_model: {
                    select: { name: true },
                },
                assigned_employee: {
                    select: {
                        first_name: true,
                        last_name: true,
                        employee_id: true,
                    },
                },
            },
            orderBy: {
                asset_tag: "asc",
            },
        }),
        prisma.mobileDevice.findMany({
            where: {
                office_number: officeCode,
            },
            include: {
                mobile_device_model: {
                    select: { name: true },
                },
                assigned_employee: {
                    select: {
                        first_name: true,
                        last_name: true,
                        employee_id: true,
                    },
                },
            },
            orderBy: {
                imei: "asc",
            },
        }),
    ]);

    const header = [
        "Type",
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
        "Notes",
    ];

    const rows = [
        ...employees.map((employee) => [
            "Employee",
            employee.first_name,
            employee.alternate_name ?? "",
            employee.last_name,
            employee.employee_id ?? "",
            employee.idir ?? "",
            employee.office_number,
            office.office_name,
            employee.program_area?.branch?.name ?? "",
            employee.program_area?.name ?? "",
            employee.job_title?.name ?? "",
            employee.is_on_leave ? "Yes" : "No",
            employee.notes ?? "",
        ]),
        ...workspaces.map((workspace) => {
            const assignedEmployee = workspace.assigned_employee
                ? `${workspace.assigned_employee.first_name} ${workspace.assigned_employee.last_name}`.trim()
                : "";

            return [
                "Workspace",
                workspace.workspace_number,
                "",
                "",
                "",
                "",
                workspace.office_number,
                office.office_name,
                "",
                workspace.restricted_program_area?.name ?? "",
                "",
                workspace.is_on_hold ? "Yes" : "No",
                workspace.notes ?? "",
            ];
        }),
        ...workstations.map((workstation) => {
            const assignedEmployee = workstation.assigned_employee
                ? `${workstation.assigned_employee.first_name} ${workstation.assigned_employee.last_name}`.trim()
                : "";

            return [
                "Workstation",
                assignedEmployee,
                "",
                "",
                "",
                "",
                workstation.office_number,
                office.office_name,
                "",
                "",
                "",
                "",
                workstation.notes ?? "",
            ];
        }),
        ...mobileDevices.map((mobileDevice) => {
            const assignedEmployee = mobileDevice.assigned_employee
                ? `${mobileDevice.assigned_employee.first_name} ${mobileDevice.assigned_employee.last_name}`.trim()
                : "";

            return [
                "Mobile Device",
                assignedEmployee,
                "",
                "",
                "",
                "",
                mobileDevice.office_number,
                office.office_name,
                "",
                "",
                "",
                "",
                mobileDevice.notes ?? "",
            ];
        }),
    ];

    return createXlsxResponse([header, ...rows], `office-records-${officeCode}.xlsx`);
}
