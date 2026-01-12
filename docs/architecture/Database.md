# Database

- Prisma Client is generated to `src/generated/prisma`.
- App DB access uses a single Prisma client (singleton) to avoid too many connections in Next dev hot reload.
- App code imports `prisma` from `src/db/client.ts`.
- Seed scripts use `src/db/seed-client.ts` so they can cleanly close connections (`prisma.$disconnect()` + `pool.end()`).
- DB query helpers live in `src/db/prisma-db.ts` (imports `prisma` from `src/db/client.ts`).
- Local dev/test DB is chosen by which `.env.*.local` file you load (sets `DATABASE_URL`).