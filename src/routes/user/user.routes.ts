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

  app.get('/auth', {}, (req, reply) => {
    reply.send({ credentials: req.signUser })
  })

  app.get<{
    Params: UserIdParamType
  }>('/me', {}, (req, reply) => {
    return controller.find(req, reply)
  })

  app.get<{ Querystring: PaginationArgs }>(
    '/admin/collaborators',
    {
      schema: {
        params: paginationSchema,
      },
    },
    (req, reply) => {
      return controller.findAll(
        {
          ...req,
          query: paginationSchema.parse(req.query),
        },
        reply,
      )
    },
  )

  app.put<{
    Body: UserUpdateType
    Params: UserIdParamType
  }>(
    '/update',
    {
      schema: {
        body: userUpdateSchema,
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
      schema: {
        params: userIdParamSchema,
      },
    },
    (req, reply) => {
      return controller.delete(req, reply)
    },
  )
}
