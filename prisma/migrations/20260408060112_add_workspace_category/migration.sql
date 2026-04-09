/*
  Warnings:

  - Added the required column `category_id` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "WorkspaceCategory" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "WorkspaceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceCategory_name_key" ON "WorkspaceCategory"("name");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "WorkspaceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
