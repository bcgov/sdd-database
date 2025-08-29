/*
  Warnings:

  - You are about to alter the column `notes` on the `Office` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.

*/
-- AlterTable
ALTER TABLE "Office" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(2000);
