/*
  Warnings:

  - Added the required column `model_id` to the `Workstation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workstation" ADD COLUMN     "model_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "WorkstationModel" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "WorkstationModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkstationModel_name_key" ON "WorkstationModel"("name");

-- AddForeignKey
ALTER TABLE "Workstation" ADD CONSTRAINT "Workstation_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "WorkstationModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
