import {Workbook} from "exceljs";
import {prisma} from "@/db/client";

export async function POST(req: Request) {
    const body = await req.json();
    const officeCode = body?.officeCode?.toString()?.trim();

    if (!officeCode) {
        return new Response(JSON.stringify({message: "Office code is required"}), {
            status: 400,
            headers: {"Content-Type": "application/json"}
        });
    }

    const mobileDevices = await prisma.mobileDevice.findMany({
        where: {
            office_number: officeCode,
        },
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

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Mobile Devices");

    sheet.addRow([
        "Office Code",
        "Employee Name",
        "IDIR",
        "Branch",
        "Program Area",
        "Job Title",
        "Notes",
        "Model",
        "IMEI",
        "Plan Status",
        "Phone Number"
    ]);

    mobileDevices.forEach((device) => {
        const employee = device.assigned_employee;

        sheet.addRow([
            officeCode,
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
        ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="mobile-devices-${officeCode}.xlsx"`
        }
    });
}
