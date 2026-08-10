export const dynamic = "force-dynamic";

import {prisma} from "@/db/client";
import {createXlsxResponse} from "../../xlsx";
import {buildMobileDeviceRedeployFilter} from "@/db/data-access/redeployFilters";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim();

    const whereClause = {
        ...buildMobileDeviceRedeployFilter(),
        ...(officeCode ? { office_number: officeCode } : {}),
    };

    const mobileDevices = await prisma.mobileDevice.findMany({
        where: whereClause,
        include: {
            mobile_device_model: {
                select: { name: true },
            },
            mobile_plan: {
                select: {
                    id: true,
                    phone_number: true,
                    data_allowance_gb: true,
                    enhanced_voicemail: true,
                    status: {
                        select: { name: true },
                    },
                    service_provider: {
                        select: { name: true },
                    },
                },
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
        device.mobile_plan?.id ?? "",
        device.mobile_plan?.phone_number ?? "",
        device.mobile_plan?.data_allowance_gb ?? "",
        device.mobile_plan?.enhanced_voicemail ? "Yes" : "No",
        device.mobile_plan?.status?.name ?? "",
        device.mobile_plan?.service_provider?.name ?? "",
    ]);

    const header = ["IMEI", "Model", "Office Number", "Notes", "Plan ID", "Phone Number", "Data Allowance (GB)", "Enhanced Voicemail", "Plan Status", "Service Provider"];

    return createXlsxResponse([header, ...rows], "redeploy-mobile-devices.xlsx");
}
