/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[employee_id]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "employee_id" DROP NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employee_id_key" ON "Employee"("employee_id");
