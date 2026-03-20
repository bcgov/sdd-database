/*
  Warnings:

  - You are about to alter the column `office_number` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.
  - The primary key for the `Office` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `office_number` on the `Office` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.
  - The primary key for the `Workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `office_number` on the `Workspace` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_office_number_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_office_number_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "office_number" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "Office" DROP CONSTRAINT "Office_pkey",
ALTER COLUMN "office_number" SET DATA TYPE VARCHAR(3),
ADD CONSTRAINT "Office_pkey" PRIMARY KEY ("office_number");

-- AlterTable
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_pkey",
ALTER COLUMN "office_number" SET DATA TYPE VARCHAR(3),
ADD CONSTRAINT "Workspace_pkey" PRIMARY KEY ("office_number", "workspace_number");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_office_number_fkey" FOREIGN KEY ("office_number") REFERENCES "Office"("office_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_office_number_fkey" FOREIGN KEY ("office_number") REFERENCES "Office"("office_number") ON DELETE RESTRICT ON UPDATE CASCADE;
