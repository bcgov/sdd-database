/*
  Warnings:

  - Added the required column `type_id` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OfficeType" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "OfficeType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfficeType_name_key" ON "OfficeType"("name");

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "OfficeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
