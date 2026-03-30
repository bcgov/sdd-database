/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "employee_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_employee_id_key" ON "Workspace"("employee_id");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
