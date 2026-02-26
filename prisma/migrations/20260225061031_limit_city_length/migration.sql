/*
  Warnings:

  - You are about to alter the column `postal_code` on the `Office` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(7)`.

*/
-- AlterTable
ALTER TABLE "Office" ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(7);
