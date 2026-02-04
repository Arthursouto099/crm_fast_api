-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "Sale" (
    "id_sale" TEXT NOT NULL,
    "id_store" TEXT NOT NULL,
    "id_customer" TEXT,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2),
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id_sale")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id_sale_item" TEXT NOT NULL,
    "id_sale" TEXT NOT NULL,
    "id_product" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id_sale_item")
);

-- CreateIndex
CREATE INDEX "Sale_id_store_idx" ON "Sale"("id_store");

-- CreateIndex
CREATE INDEX "Sale_id_customer_idx" ON "Sale"("id_customer");

-- CreateIndex
CREATE INDEX "SaleItem_id_sale_idx" ON "SaleItem"("id_sale");

-- CreateIndex
CREATE INDEX "SaleItem_id_product_idx" ON "SaleItem"("id_product");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "Customer"("id_customer") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_id_store_fkey" FOREIGN KEY ("id_store") REFERENCES "Store"("id_store") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_id_sale_fkey" FOREIGN KEY ("id_sale") REFERENCES "Sale"("id_sale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product"("id_product") ON DELETE RESTRICT ON UPDATE CASCADE;
