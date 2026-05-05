/*
  Warnings:

  - Made the column `office_number` on table `MobileDevice` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MobileDevice" DROP CONSTRAINT "MobileDevice_office_number_fkey";

-- AlterTable
ALTER TABLE "MobileDevice" ALTER COLUMN "office_number" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MobileDevice" ADD CONSTRAINT "MobileDevice_office_number_fkey" FOREIGN KEY ("office_number") REFERENCES "Office"("office_number") ON DELETE RESTRICT ON UPDATE CASCADE;
