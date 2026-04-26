/*
  Warnings:

  - Added the required column `office_number` to the `Workstation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workstation" ADD COLUMN     "office_number" VARCHAR(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Workstation" ADD CONSTRAINT "Workstation_office_number_fkey" FOREIGN KEY ("office_number") REFERENCES "Office"("office_number") ON DELETE RESTRICT ON UPDATE CASCADE;
