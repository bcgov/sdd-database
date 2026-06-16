/*
  Warnings:

  - A unique constraint covering the columns `[gilr]` on the table `MobileDevice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MobileDevice" ADD COLUMN     "gilr" VARCHAR(25);

-- CreateIndex
CREATE UNIQUE INDEX "MobileDevice_gilr_key" ON "MobileDevice"("gilr");
