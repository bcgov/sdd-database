-- DropForeignKey
ALTER TABLE "EmployeeOhsAccommodation" DROP CONSTRAINT "EmployeeOhsAccommodation_employee_id_fkey";

-- AddForeignKey
ALTER TABLE "EmployeeOhsAccommodation" ADD CONSTRAINT "EmployeeOhsAccommodation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
