/*
  Warnings:

  - The values [ADMIN,COLLABOR,GUEST] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ActionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ActionPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('ADM', 'OWNER', 'COLABORADOR', 'USUARIO');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "public"."Roles_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USUARIO';
COMMIT;

-- DropForeignKey
ALTER TABLE "ActionItem" DROP CONSTRAINT "ActionItem_actionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "ActionPlan" DROP CONSTRAINT "ActionPlan_id_project_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_id_project_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_id_user_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USUARIO',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "ActionItem";

-- DropTable
DROP TABLE "ActionPlan";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "UserProject";

-- DropEnum
DROP TYPE "ActionStatus";

-- DropEnum
DROP TYPE "OriginType";

-- DropEnum
DROP TYPE "PlanStatus";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "ProjectStatus";

-- DropEnum
DROP TYPE "RolesProject";

-- CreateTable
CREATE TABLE "Store" (
    "id_store" TEXT NOT NULL,
    "id_owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "store_image" TEXT,
    "store_bio" TEXT,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id_store")
);

-- CreateTable
CREATE TABLE "Product" (
    "id_product" TEXT NOT NULL,
    "id_store" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "product_price" DECIMAL(10,2) NOT NULL,
    "sizeMl" INTEGER,
    "quantity" INTEGER,
    "product_image" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id_product")
);

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_id_owner_fkey" FOREIGN KEY ("id_owner") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_store_fkey" FOREIGN KEY ("id_store") REFERENCES "Store"("id_store") ON DELETE RESTRICT ON UPDATE CASCADE;
