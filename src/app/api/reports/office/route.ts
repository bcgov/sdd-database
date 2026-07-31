export const dynamic = "force-dynamic";

import {Workbook} from "exceljs";
import {prisma} from "@/db/client";
import {Prisma} from "@/generated/prisma/client"

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

    const workbook = new Workbook();

    const employeesSheet = workbook.addWorksheet("Employees");
    employeesSheet.addRow([
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
    ]);

    employees.forEach((employee) => {
        employeesSheet.addRow([
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
        ]);
    });

    const workspacesSheet = workbook.addWorksheet("Workspaces");
    workspacesSheet.addRow([
        "Office Number",
        "Workspace Number",
        "Category",
        "Desk Type",
        "Office Floor",
        "On Hold",
        "Assigned Employee",
        "Restricted Program Area",
        "Notes",
    ]);

    workspaces.forEach((workspace) => {
        const assignedEmployee = workspace.assigned_employee
            ? `${workspace.assigned_employee.first_name} ${workspace.assigned_employee.last_name}`.trim()
            : "";

        workspacesSheet.addRow([
            workspace.office_number,
            workspace.workspace_number,
            workspace.category?.name ?? "",
            workspace.desk_type?.name ?? "",
            workspace.office_floor,
            workspace.is_on_hold ? "Yes" : "No",
            assignedEmployee,
            workspace.restricted_program_area?.name ?? "",
            workspace.notes ?? "",
        ]);
    });

    const workstationsSheet = workbook.addWorksheet("Workstations");
    workstationsSheet.addRow([
        "Asset Tag",
        "Model",
        "Office Number",
        "Assigned Employee",
        "Notes",
    ]);

    workstations.forEach((workstation) => {
        const assignedEmployee = workstation.assigned_employee
            ? `${workstation.assigned_employee.first_name} ${workstation.assigned_employee.last_name}`.trim()
            : "";

        workstationsSheet.addRow([
            workstation.asset_tag,
            workstation.workstation_model?.name ?? "",
            workstation.office_number,
            assignedEmployee,
            workstation.notes ?? "",
        ]);
    });

    const mobileDevicesSheet = workbook.addWorksheet("Mobile Devices");
    mobileDevicesSheet.addRow([
        "IMEI",
        "Model",
        "Office Number",
        "Assigned Employee",
        "Notes",
    ]);

    mobileDevices.forEach((mobileDevice) => {
        const assignedEmployee = mobileDevice.assigned_employee
            ? `${mobileDevice.assigned_employee.first_name} ${mobileDevice.assigned_employee.last_name}`.trim()
            : "";

        mobileDevicesSheet.addRow([
            mobileDevice.imei ?? "",
            mobileDevice.mobile_device_model?.name ?? "",
            mobileDevice.office_number,
            assignedEmployee,
            mobileDevice.notes ?? "",
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="office-records-${officeCode}.xlsx"`,
        },
    });
}
