/*
  Warnings:

  - You are about to drop the column `branchId` on the `ProgramArea` table. All the data in the column will be lost.
  - Added the required column `branch_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `ProgramArea` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProgramArea" DROP CONSTRAINT "ProgramArea_branchId_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "branch_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProgramArea" DROP COLUMN "branchId",
ADD COLUMN     "branch_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramArea" ADD CONSTRAINT "ProgramArea_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
