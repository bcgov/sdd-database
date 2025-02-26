-- CreateTable
CREATE TABLE "Office" (
    "office_number" INTEGER NOT NULL,
    "office_name" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("office_number")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_office_name_key" ON "Office"("office_name");

-- CreateIndex
CREATE UNIQUE INDEX "Office_postal_code_key" ON "Office"("postal_code");
