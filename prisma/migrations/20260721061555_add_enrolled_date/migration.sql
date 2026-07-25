/*
  Warnings:

  - Added the required column `enrolled_date` to the `MobileDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MobileDevice" ADD COLUMN     "enrolled_date" DATE NOT NULL;
