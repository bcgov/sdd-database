/*
  Warnings:

  - The primary key for the `Office` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Office" DROP CONSTRAINT "Office_pkey",
ALTER COLUMN "office_number" SET DATA TYPE TEXT,
ADD CONSTRAINT "Office_pkey" PRIMARY KEY ("office_number");
