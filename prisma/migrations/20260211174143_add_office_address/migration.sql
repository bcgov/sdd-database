/*
  Warnings:

  - Added the required column `address` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "address" VARCHAR(45) NOT NULL;
