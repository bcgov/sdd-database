/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `MobileDevice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MobileDevice" ADD COLUMN     "employee_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "MobileDevice_employee_id_key" ON "MobileDevice"("employee_id");

-- AddForeignKey
ALTER TABLE "MobileDevice" ADD CONSTRAINT "MobileDevice_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
