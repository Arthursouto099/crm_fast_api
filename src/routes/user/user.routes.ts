import UserController from '../../controllers/user.controller'
import authMiddleware from '../../middlewares/auth'
import {
  userIdParamSchema,
  UserIdParamType,
  userUpdateSchema,
  UserUpdateType,
} from '../../schemas/user.schemas'
import { FastifyInstanceTyped } from '../../types/types'
import { PaginationArgs, paginationSchema } from '../../utils/pagination'

export default async function userRoutes(app: FastifyInstanceTyped) {
  const controller = new UserController(app.db)

  app.get(
    '/auth',
    {
      preHandler: [authMiddleware],
    },
    (req, reply) => {
      reply.send({ credentials: req.signUser })
    },
  )

  app.get<{
    Params: UserIdParamType
  }>(
    '/admin/:id_user',
    {
      preHandler: [authMiddleware],
      schema: {
        params: userIdParamSchema,
      },
    },
    (req, reply) => {
      return controller.find(req, reply)
    },
  )

  app.get<{ Params: PaginationArgs }>(
    '/admin/collaborators',
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

  app.put<{
    Body: UserUpdateType
    Params: UserIdParamType
  }>(
    '/update/:id_user',
    {
      preHandler: [authMiddleware],
      schema: {
        body: userUpdateSchema,
        params: userIdParamSchema,
      },
    },
    (req, reply) => {
      return controller.update(req, reply)
    },
  )

  app.delete<{
    Params: UserIdParamType
  }>(
    '/delete/:id_user',
    {
      preHandler: [authMiddleware],
      schema: {
        params: userIdParamSchema,
      },
    },
    (req, reply) => {
      return controller.delete(req, reply)
    },
  )
}
