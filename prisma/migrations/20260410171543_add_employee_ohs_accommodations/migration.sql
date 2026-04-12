-- CreateTable
CREATE TABLE "OhsAccommodationType" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "OhsAccommodationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeOhsAccommodation" (
    "employee_id" INTEGER NOT NULL,
    "ohs_accommodation_type_id" INTEGER NOT NULL,

    CONSTRAINT "EmployeeOhsAccommodation_pkey" PRIMARY KEY ("employee_id","ohs_accommodation_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OhsAccommodationType_name_key" ON "OhsAccommodationType"("name");

-- AddForeignKey
ALTER TABLE "EmployeeOhsAccommodation" ADD CONSTRAINT "EmployeeOhsAccommodation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeOhsAccommodation" ADD CONSTRAINT "EmployeeOhsAccommodation_ohs_accommodation_type_id_fkey" FOREIGN KEY ("ohs_accommodation_type_id") REFERENCES "OhsAccommodationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
