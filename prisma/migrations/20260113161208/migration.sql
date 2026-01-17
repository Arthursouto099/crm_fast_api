-- CreateEnum
CREATE TYPE "TypePlan" AS ENUM ('GRATIS', 'BASICO', 'AVANCADO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "typePlan" "TypePlan" NOT NULL DEFAULT 'GRATIS';
