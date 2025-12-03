-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'COLLABOR', 'GUEST');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'GUEST',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
