/*
  Warnings:

  - Added the required column `desk_type_id` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "desk_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DeskType" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "DeskType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeskType_name_key" ON "DeskType"("name");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_desk_type_id_fkey" FOREIGN KEY ("desk_type_id") REFERENCES "DeskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
