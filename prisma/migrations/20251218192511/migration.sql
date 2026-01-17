/*
  Warnings:

  - Added the required column `store_name` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "store_name" TEXT NOT NULL;
