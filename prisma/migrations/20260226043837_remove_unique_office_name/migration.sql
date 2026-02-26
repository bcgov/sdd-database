-- DropIndex
DROP INDEX "Office_office_name_key";

-- AlterTable
ALTER TABLE "Office" ALTER COLUMN "office_name" SET DATA TYPE TEXT;
