-- CreateTable
CREATE TABLE "Workspace" (
    "office_number" TEXT NOT NULL,
    "workspace_number" VARCHAR(4) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("office_number","workspace_number")
);

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_office_number_fkey" FOREIGN KEY ("office_number") REFERENCES "Office"("office_number") ON DELETE RESTRICT ON UPDATE CASCADE;
