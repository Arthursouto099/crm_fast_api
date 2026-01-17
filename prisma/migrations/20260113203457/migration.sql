-- CreateEnum
CREATE TYPE "typeMovement" AS ENUM ('AJUSTE', 'SAIDA', 'ENTRADA');

-- AlterTable
ALTER TABLE "MovementStock" ADD COLUMN     "typeMovement" "typeMovement" NOT NULL DEFAULT 'ENTRADA';
