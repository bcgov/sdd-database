/*
  Warnings:

  - The primary key for the `MobileDevice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[imei]` on the table `MobileDevice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MobileDevice" DROP CONSTRAINT "MobileDevice_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "imei" DROP NOT NULL,
ADD CONSTRAINT "MobileDevice_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "MobileDevice_imei_key" ON "MobileDevice"("imei");
