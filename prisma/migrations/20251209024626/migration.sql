-- CreateEnum
CREATE TYPE "OriginType" AS ENUM ('NC', 'RISCO', 'OPORTUNIDADE', 'OUTRO');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ATRASADO');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateTable
CREATE TABLE "ActionPlan" (
    "id_action_plan" TEXT NOT NULL,
    "id_project" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "context" TEXT,
    "origin" "OriginType" NOT NULL DEFAULT 'OUTRO',
    "status" "PlanStatus" NOT NULL DEFAULT 'ABERTO',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionPlan_pkey" PRIMARY KEY ("id_action_plan")
);

-- CreateTable
CREATE TABLE "ActionItem" (
    "id_action_item" TEXT NOT NULL,
    "actionPlanId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "ActionStatus" NOT NULL DEFAULT 'PLANEJADA',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIA',
    "cost" DOUBLE PRECISION,
    "evidenceUrl" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id_action_item")
);

-- AddForeignKey
ALTER TABLE "ActionPlan" ADD CONSTRAINT "ActionPlan_id_project_fkey" FOREIGN KEY ("id_project") REFERENCES "Project"("id_project") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_actionPlanId_fkey" FOREIGN KEY ("actionPlanId") REFERENCES "ActionPlan"("id_action_plan") ON DELETE RESTRICT ON UPDATE CASCADE;
