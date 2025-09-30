/*
  Warnings:

  - A unique constraint covering the columns `[branch_id,name]` on the table `ProgramArea` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ProgramArea_name_key";

-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "program_area_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ProgramArea_branch_id_name_key" ON "public"."ProgramArea"("branch_id", "name");

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_program_area_id_fkey" FOREIGN KEY ("program_area_id") REFERENCES "public"."ProgramArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
