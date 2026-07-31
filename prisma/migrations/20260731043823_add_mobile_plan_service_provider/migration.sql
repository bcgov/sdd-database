/*
  Warnings:

  - Added the required column `service_provider_id` to the `MobilePlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MobilePlan" ADD COLUMN     "service_provider_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MobilePlanServiceProvider" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "MobilePlanServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobilePlanServiceProvider_name_key" ON "MobilePlanServiceProvider"("name");

-- AddForeignKey
ALTER TABLE "MobilePlan" ADD CONSTRAINT "MobilePlan_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "MobilePlanServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
