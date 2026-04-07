/*
  Warnings:

  - Made the column `job_title_id` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_job_title_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "job_title_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "JobTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
