export const dynamic = "force-dynamic";

import {Workbook} from "exceljs";
import {prisma} from "@/db/client";

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
                    idir: true,
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

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Workstations");

    sheet.addRow(["Asset Tag", "Model", "Office Number", "Assigned Employee", "Employee IDIR", "Notes"]);

    workstations.forEach((workstation) => {
        sheet.addRow([
            workstation.asset_tag,
            workstation.workstation_model?.name ?? "",
            workstation.office_number,
            workstation.assigned_employee ? `${workstation.assigned_employee.first_name} ${workstation.assigned_employee.last_name}` : "",
            workstation.assigned_employee?.idir ?? "",
            workstation.notes ?? "",
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=workstations.xlsx",
        },
    });
}
