-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "restricted_program_area_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_restricted_program_area_id_fkey" FOREIGN KEY ("restricted_program_area_id") REFERENCES "ProgramArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
