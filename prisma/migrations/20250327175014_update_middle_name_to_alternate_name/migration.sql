/*
  Warnings:

  - You are about to drop the column `middle_name` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "middle_name",
ADD COLUMN     "alternate_name" TEXT;
