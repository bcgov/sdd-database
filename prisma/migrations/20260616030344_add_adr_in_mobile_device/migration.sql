/*
  Warnings:

  - A unique constraint covering the columns `[adr]` on the table `MobileDevice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MobileDevice" ADD COLUMN     "adr" VARCHAR(18);

-- CreateIndex
CREATE UNIQUE INDEX "MobileDevice_adr_key" ON "MobileDevice"("adr");
