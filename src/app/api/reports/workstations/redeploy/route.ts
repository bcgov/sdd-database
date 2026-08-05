export const dynamic = "force-dynamic";

import {prisma} from "@/db/client";
import {createXlsxResponse} from "../../xlsx";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim();

    const whereClause = {
        employee_id: null,
        ...(officeCode ? { office_number: officeCode } : {}),
    };

    const workstations = await prisma.workstation.findMany({
        where: whereClause,
        include: {
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
        workstation.notes ?? "",
    ]);

    const header = ["Asset Tag", "Model", "Office Number", "Notes"];

    return createXlsxResponse([header, ...rows], "redeploy-workstations.xlsx");
}
