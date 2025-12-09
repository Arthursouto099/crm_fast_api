import ProjectController from '../../controllers/project.controller'
import authMiddleware from '../../middlewares/auth'
import {
  createProjectSchema,
  CreateProjectType,
  projectIdParamsSchema,
  ProjectIdType,
  updateProjectSchema,
  UpdateProjectType,
} from '../../schemas/project.schemas'
import { FastifyInstanceTyped } from '../../types/types'
import { PaginationArgs, paginationSchema } from '../../utils/pagination'

export default function ProjectRoutes(app: FastifyInstanceTyped) {
  const controller = new ProjectController(app.db)

  app.post<{
    Body: CreateProjectType
  }>(
    '/create',
    {
      preHandler: [authMiddleware],
      schema: {
        body: createProjectSchema,
      },
    },
    (req, reply) => {
      return controller.create(req, reply)
    },
  )

  app.get<{ Params: PaginationArgs }>(
    '/myProjects/all',
    {
      preHandler: [authMiddleware],
      schema: {
        params: paginationSchema,
      },
    },
    (req, reply) => {
      return controller.findAll(req, reply)
    },
  )

  app.put<{ Body: UpdateProjectType; Params: ProjectIdType }>(
    '/update/:id_project',
    {
      preHandler: [authMiddleware],
      schema: {
        body: updateProjectSchema,
        params: projectIdParamsSchema,
      },
    },
    (req, reply) => {
      return controller.update(req, reply)
    },
  )

  app.delete<{ Params: ProjectIdType }>(
    '/delete/:id_project',

    {
      preHandler: [authMiddleware],
      schema: {
        params: projectIdParamsSchema,
      },
    },
    (req, reply) => {
      return controller.delete(req, reply)
    },
  )

  app.get<{ Params: ProjectIdType }>(
    '/:id_project',
    {
      preHandler: [authMiddleware],
      schema: {
        params: projectIdParamsSchema,
      },
    },
    (req, reply) => {
      return controller.find(req, reply)
    },
  )
}
