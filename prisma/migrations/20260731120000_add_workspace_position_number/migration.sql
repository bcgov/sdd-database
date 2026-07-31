-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN "position_number" VARCHAR(8);

ALTER TABLE "Workspace"
ADD CONSTRAINT "Workspace_position_number_check"
CHECK ("position_number" IS NULL OR "position_number" ~ '^[0-9]{8}$');