import {prisma} from "@/db/client";

export async function GET() {
    const statuses = [
        {value: "free", label: "Free"},
        {value: "onhold", label: "On Hold"},
    ];

    return new Response(JSON.stringify({statuses}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
