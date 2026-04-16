/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `Workstation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workstation" ADD COLUMN     "employee_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Workstation_employee_id_key" ON "Workstation"("employee_id");

-- AddForeignKey
ALTER TABLE "Workstation" ADD CONSTRAINT "Workstation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
