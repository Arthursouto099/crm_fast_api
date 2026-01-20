/*
  Warnings:

  - A unique constraint covering the columns `[id_address]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "email_customer" DROP NOT NULL,
ALTER COLUMN "phone_customer" DROP NOT NULL,
ALTER COLUMN "id_address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CustomerAddress" ALTER COLUMN "complement" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_address_key" ON "Customer"("id_address");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_id_address_fkey" FOREIGN KEY ("id_address") REFERENCES "CustomerAddress"("id_customerAddress") ON DELETE SET NULL ON UPDATE CASCADE;
