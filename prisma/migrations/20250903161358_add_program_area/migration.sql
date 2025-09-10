-- AlterTable
ALTER TABLE "public"."Branch" ALTER COLUMN "name" SET DATA TYPE CITEXT;

-- CreateTable
CREATE TABLE "public"."ProgramArea" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "ProgramArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramArea_name_key" ON "public"."ProgramArea"("name");

-- AddForeignKey
ALTER TABLE "public"."ProgramArea" ADD CONSTRAINT "ProgramArea_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
