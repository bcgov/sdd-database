/*
  Warnings:

  - Added the required column `model_id` to the `MobileDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MobileDevice" ADD COLUMN     "model_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MobileDeviceModel" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "MobileDeviceModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobileDeviceModel_name_key" ON "MobileDeviceModel"("name");

-- AddForeignKey
ALTER TABLE "MobileDevice" ADD CONSTRAINT "MobileDevice_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "MobileDeviceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
