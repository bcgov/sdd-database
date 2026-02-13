/*
  Warnings:

  - Added the required column `client_service_type_id` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "client_service_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TypeOfClientService" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "TypeOfClientService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeOfClientService_name_key" ON "TypeOfClientService"("name");

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_client_service_type_id_fkey" FOREIGN KEY ("client_service_type_id") REFERENCES "TypeOfClientService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
