/*
  Warnings:

  - The primary key for the `Workstation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Workstation" DROP CONSTRAINT "Workstation_pkey",
ALTER COLUMN "asset_tag" SET DATA TYPE CITEXT,
ADD CONSTRAINT "Workstation_pkey" PRIMARY KEY ("asset_tag");
