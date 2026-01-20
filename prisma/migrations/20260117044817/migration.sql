/*
  Warnings:

  - Added the required column `id_store` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "id_store" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_id_store_fkey" FOREIGN KEY ("id_store") REFERENCES "Store"("id_store") ON DELETE RESTRICT ON UPDATE CASCADE;
