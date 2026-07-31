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

function createPool(): Pool {
    if (globalThis.__pgPool) {
        return globalThis.__pgPool;
    }

    const connectionString = getDatabaseUrl();
    const pool = new Pool({connectionString});
    globalThis.__pgPool = pool;

    return pool;
}

function createPrismaClient(): PrismaClient {
    if (globalThis.__prisma) {
        return globalThis.__prisma;
    }

    const pool = createPool();
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({adapter});

    globalThis.__prisma = prisma;

    return prisma;
}

const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop, receiver) {
        return Reflect.get(createPrismaClient(), prop, receiver);
    },
    has(_target, prop) {
        return prop in createPrismaClient();
    },
    ownKeys() {
        return Reflect.ownKeys(createPrismaClient());
    },
    getOwnPropertyDescriptor(_target, prop) {
        return Object.getOwnPropertyDescriptor(createPrismaClient(), prop);
    },
});

const pool = new Proxy({} as Pool, {
    get(_target, prop, receiver) {
        return Reflect.get(createPool(), prop, receiver);
    },
    has(_target, prop) {
        return prop in createPool();
    },
    ownKeys() {
        return Reflect.ownKeys(createPool());
    },
    getOwnPropertyDescriptor(_target, prop) {
        return Object.getOwnPropertyDescriptor(createPool(), prop);
    },
});

export { prisma, pool };
export function getPrismaClient(): PrismaClient {
    return createPrismaClient();
}
export function getPool(): Pool {
    return createPool();
}
