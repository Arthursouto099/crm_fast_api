-- CreateEnum
CREATE TYPE "TypeCustomer" AS ENUM ('PF', 'PJ');

-- CreateTable
CREATE TABLE "Customer" (
    "id_customer" TEXT NOT NULL,
    "name_customer" TEXT NOT NULL,
    "type" "TypeCustomer" NOT NULL,
    "document_customer" TEXT NOT NULL,
    "email_customer" TEXT NOT NULL,
    "phone_customer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id_address" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id_customer")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id_customerAddress" TEXT NOT NULL,
    "id_customer" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id_customerAddress")
);

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "Customer"("id_customer") ON DELETE RESTRICT ON UPDATE CASCADE;
