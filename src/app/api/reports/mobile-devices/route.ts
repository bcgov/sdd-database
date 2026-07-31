export const dynamic = "force-dynamic";

import {prisma} from "@/db/client";
import {createXlsxResponse} from "../xlsx";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim();
    const imei = body?.imei?.toString()?.trim();

    if (!officeCode && !imei) {
        return new Response(JSON.stringify({message: "Office code or IMEI is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
        });
    }

    const whereClause = officeCode
        ? { office_number: officeCode }
        : { imei };

    const mobileDevices = await prisma.mobileDevice.findMany({
        where: whereClause,
        include: {
            assigned_employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    idir: true,
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
            mobile_device_model: {
                select: {
                    name: true,
                },
            },
            mobile_plan: {
                select: {
                    id: true,
                    phone_number: true,
                },
            },
        },
    });

    const rows = mobileDevices.map((device) => {
        const employee = device.assigned_employee;

        return [
            officeCode ?? "",
            employee ? `${employee.first_name} ${employee.last_name}` : "",
            employee?.idir ?? "",
            employee?.program_area?.branch?.name ?? "",
            employee?.program_area?.name ?? "",
            employee?.job_title?.name ?? "",
            employee?.notes ?? "",
            device.mobile_device_model?.name ?? "",
            device.imei ?? "",
            device.mobile_plan ? "Yes" : "No",
            device.mobile_plan?.phone_number ?? ""
        ];
    });

    const header = ["Office Code", "Employee Name", "IDIR", "Branch", "Program Area", "Job Title", "Notes", "Model", "IMEI", "Plan Status", "Phone Number"];
    const filenameBase = officeCode || imei || "all";

    return createXlsxResponse([header, ...rows], `mobile-devices-${filenameBase}.xlsx`);
}
