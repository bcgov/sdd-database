/*
  Warnings:

  - Added the required column `status_id` to the `MobilePlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MobilePlan" ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MobilePlanStatus" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "MobilePlanStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobilePlanStatus_name_key" ON "MobilePlanStatus"("name");

-- AddForeignKey
ALTER TABLE "MobilePlan" ADD CONSTRAINT "MobilePlan_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "MobilePlanStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
