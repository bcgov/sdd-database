export const dynamic = "force-dynamic";

import {prisma} from "@/db/client";

export async function GET() {
    const workstationModels = await prisma.workstationModel.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return Response.json({
        models: workstationModels.map((model) => ({
            id: model.id.toString(),
            label: model.name,
        })),
    });
}
