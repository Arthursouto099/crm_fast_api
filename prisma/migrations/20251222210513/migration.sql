/*
  Warnings:

  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_id_store_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_id_owner_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quantity",
ADD COLUMN     "low_stock_at" INTEGER,
ADD COLUMN     "stock_quantity" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_id_owner_fkey" FOREIGN KEY ("id_owner") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_store_fkey" FOREIGN KEY ("id_store") REFERENCES "Store"("id_store") ON DELETE CASCADE ON UPDATE CASCADE;
