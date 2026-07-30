import {prisma} from "@/db/client";

export async function GET() {
    const [branches, programAreas] = await Promise.all([
        prisma.branch.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        }),
        prisma.programArea.findMany({
            select: {
                id: true,
                name: true,
                branch_id: true,
            },
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    return new Response(JSON.stringify({branches, programAreas}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
