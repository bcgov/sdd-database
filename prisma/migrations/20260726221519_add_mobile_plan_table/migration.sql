-- CreateTable
CREATE TABLE "MobilePlan" (
    "id" SERIAL NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "mobile_device_id" INTEGER,

    CONSTRAINT "MobilePlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MobilePlan_phone_number_key" ON "MobilePlan"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "MobilePlan_mobile_device_id_key" ON "MobilePlan"("mobile_device_id");

-- AddForeignKey
ALTER TABLE "MobilePlan" ADD CONSTRAINT "MobilePlan_mobile_device_id_fkey" FOREIGN KEY ("mobile_device_id") REFERENCES "MobileDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
