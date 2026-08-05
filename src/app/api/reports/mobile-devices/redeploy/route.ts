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

    const mobileDevices = await prisma.mobileDevice.findMany({
        where: whereClause,
        include: {
            mobile_device_model: {
                select: { name: true },
            },
        },
        orderBy: {
            id: "asc",
        },
    });

    const rows = mobileDevices.map((device) => [
        device.imei ?? "",
        device.mobile_device_model?.name ?? "",
        device.office_number,
        device.notes ?? "",
    ]);

    const header = ["IMEI", "Model", "Office Number", "Notes"];

    return createXlsxResponse([header, ...rows], "redeploy-mobile-devices.xlsx");
}
