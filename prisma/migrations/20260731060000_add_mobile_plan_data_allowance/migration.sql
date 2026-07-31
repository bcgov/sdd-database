/*
  Warnings:

  - Added the required column `data_allowance_gb` to the `MobilePlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MobilePlan"
ADD COLUMN "data_allowance_gb" INTEGER NOT NULL,
ADD CONSTRAINT "MobilePlan_data_allowance_gb_check"
CHECK ("data_allowance_gb" IN (6, 20, 100));
