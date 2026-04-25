-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_workspace_assignment_type_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "workspace_assignment_type_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_workspace_assignment_type_id_fkey" FOREIGN KEY ("workspace_assignment_type_id") REFERENCES "WorkspaceAssignmentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
