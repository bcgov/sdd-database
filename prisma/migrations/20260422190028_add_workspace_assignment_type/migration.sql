/*
  Warnings:

  - Added the required column `workspace_assignment_type_id` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "workspace_assignment_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "WorkspaceAssignmentType" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "WorkspaceAssignmentType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceAssignmentType_name_key" ON "WorkspaceAssignmentType"("name");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_workspace_assignment_type_id_fkey" FOREIGN KEY ("workspace_assignment_type_id") REFERENCES "WorkspaceAssignmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
