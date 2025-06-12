/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `employee_id` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ALTER COLUMN "employee_id" SET DATA TYPE VARCHAR(6),
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id");
