/*
  Warnings:

  - You are about to alter the column `notes` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2000)` to `VarChar(200)`.
  - You are about to alter the column `notes` on the `Workspace` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2000)` to `VarChar(200)`.
  - You are about to alter the column `notes` on the `Workstation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2000)` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "MobileDevice" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Workstation" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(200);
