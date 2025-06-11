/*
  Warnings:

  - You are about to alter the column `first_name` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `last_name` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `alternate_name` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "alternate_name" SET DATA TYPE VARCHAR(30);
