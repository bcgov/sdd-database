/*
  Warnings:

  - A unique constraint covering the columns `[idir]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idir` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "idir" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_idir_key" ON "Employee"("idir");
