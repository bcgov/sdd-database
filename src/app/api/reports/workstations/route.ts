export const dynamic = "force-dynamic";

import {prisma} from "@/db/client";
import {createXlsxResponse} from "../xlsx";

export async function POST(req: Request) {
    const body = await req.json();
    const assetTag = body?.assetTag?.toString()?.trim();
    const officeCode = body?.officeCode?.toString()?.trim();
    const modelName = body?.modelName?.toString()?.trim();

    if (!assetTag && !officeCode) {
        return new Response(JSON.stringify({message: "Asset tag or office code is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"},
        });
    }

    const whereClause = assetTag
        ? { asset_tag: assetTag }
        : officeCode
            ? {
                office_number: officeCode,
                ...(modelName ? { workstation_model: { is: { name: { contains: modelName } } } } : {}),
            }
            : {};

    const workstations = await prisma.workstation.findMany({
        where: whereClause,
        include: {
            assigned_employee: {
                select: {
                    first_name: true,
                    last_name: true,
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
                                },
                            },
                        },
                    },
                    job_title: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            workstation_model: {
                select: { name: true },
            },
        },
        orderBy: {
            asset_tag: "asc",
        },
    });

    const rows = workstations.map((workstation) => [
        workstation.asset_tag,
        workstation.workstation_model?.name ?? "",
        workstation.office_number,
        workstation.assigned_employee ? `${workstation.assigned_employee.first_name} ${workstation.assigned_employee.last_name}` : "",
        workstation.assigned_employee?.employee_id ?? "",
        workstation.assigned_employee?.idir ?? "",
        workstation.assigned_employee?.program_area?.branch?.name ?? "",
        workstation.assigned_employee?.program_area?.name ?? "",
        workstation.assigned_employee?.job_title?.name ?? "",
        workstation.assigned_employee?.is_on_leave ? "Yes" : "No",
        workstation.assigned_employee?.notes ?? "",
        workstation.notes ?? "",
    ]);

    const header = [
        "Asset Tag",
        "Model",
        "Office Number",
        "Assigned Employee",
        "Employee ID",
        "Employee IDIR",
        "Employee Branch",
        "Employee Program Area",
        "Employee Job Title",
        "Employee Leave Status",
        "Employee Notes",
        "Workstation Notes",
    ];

    return createXlsxResponse([header, ...rows], "workstations.xlsx");
}
