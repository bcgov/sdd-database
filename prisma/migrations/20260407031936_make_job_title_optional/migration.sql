-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_job_title_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "job_title_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
