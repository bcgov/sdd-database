-- AlterTable
ALTER TABLE "MobileDevice" ADD COLUMN     "office_number" VARCHAR(3);

-- AddForeignKey
ALTER TABLE "MobileDevice" ADD CONSTRAINT "MobileDevice_office_number_fkey" FOREIGN KEY ("office_number") REFERENCES "Office"("office_number") ON DELETE SET NULL ON UPDATE CASCADE;
