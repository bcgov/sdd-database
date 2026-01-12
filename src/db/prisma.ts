import {PrismaClient} from "@/generated/prisma/client";

import {Pool} from "pg";

import {PrismaPg} from "@prisma/adapter-pg";


function getDatabaseUrl(): string {
    const url = process.env.DATABASE_URL;

    if (!url) {
        throw new Error("DATABASE_URL is not set");
    }

    return url;
}

// Prevent creating many clients/pools during Next.js hot reload (dev)
declare global {
    var __prisma: PrismaClient | undefined;
    var __pgPool: Pool | undefined;
}

const connectionString = getDatabaseUrl();

const pool = globalThis.__pgPool ?? new Pool({connectionString});

const adapter = new PrismaPg(pool)

const prisma = globalThis.__prisma ?? new PrismaClient({adapter});

// since hot-reload only happens in development run-time
if (process.env.NODE_ENV !== "production") {
    globalThis.__pgPool = pool;
    globalThis.__prisma = prisma;
}

export { prisma, pool };
