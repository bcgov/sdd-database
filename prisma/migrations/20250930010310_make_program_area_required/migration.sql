/*
  Warnings:

  - Made the column `program_area_id` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_program_area_id_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" ALTER COLUMN "program_area_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_program_area_id_fkey" FOREIGN KEY ("program_area_id") REFERENCES "public"."ProgramArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
