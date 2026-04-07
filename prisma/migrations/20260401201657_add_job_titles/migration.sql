-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "job_title_id" INTEGER;

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramAreaJobTitle" (
    "program_area_id" INTEGER NOT NULL,
    "job_title_id" INTEGER NOT NULL,

    CONSTRAINT "ProgramAreaJobTitle_pkey" PRIMARY KEY ("program_area_id","job_title_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_name_key" ON "JobTitle"("name");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramAreaJobTitle" ADD CONSTRAINT "ProgramAreaJobTitle_program_area_id_fkey" FOREIGN KEY ("program_area_id") REFERENCES "ProgramArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramAreaJobTitle" ADD CONSTRAINT "ProgramAreaJobTitle_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "JobTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
