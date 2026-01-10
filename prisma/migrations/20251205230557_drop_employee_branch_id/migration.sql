/*
  Warnings:

  - You are about to drop the column `branch_id` on the `Employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_branch_id_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "branch_id";
