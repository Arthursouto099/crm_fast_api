// src/http/schemas/project.schemas.ts (ou onde você organizar)

import { z } from 'zod'
import { ProjectStatus } from '../../generated/client'

// Base comum para create/update
export const projectBaseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  background_url: z.url('URL inválida').nullable().optional(),
  status: z.enum(ProjectStatus).optional(),
  color: z.string().max(16, 'Cor muito longa').nullable().optional(),
  isPublic: z.boolean().optional().default(true),
  category: z.string()
})

// 🟢 CREATE (body que vem do cliente – sem ownerId)
export const createProjectSchema = projectBaseSchema

// 🟡 UPDATE (body parcial – todos opcionais)
export const updateProjectSchema = projectBaseSchema.partial()

// 🔵 PARAMS: /projects/:id_project
export const projectIdParamsSchema = z.object({
  id_project: z.uuid(), 
})

export const projectOnwerParamSchema = z.object({
    id_user: z.uuid()
})


// 🔄 Types inferidos (pra usar em controller/service se quiser)
export type CreateProjectType = z.infer<typeof createProjectSchema>
export type UpdateProjectType = z.infer<typeof updateProjectSchema>
export type ProjectIdType = z.infer<typeof projectIdParamsSchema>
export type ProjectOnwerType = z.infer<typeof projectOnwerParamSchema>

