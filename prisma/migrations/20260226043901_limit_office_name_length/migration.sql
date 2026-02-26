/*
  Warnings:

  - You are about to alter the column `office_name` on the `Office` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(35)`.

*/
-- AlterTable
ALTER TABLE "Office" ALTER COLUMN "office_name" SET DATA TYPE VARCHAR(35);
