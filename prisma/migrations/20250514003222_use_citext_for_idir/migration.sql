-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "idir" SET DATA TYPE CITEXT;
