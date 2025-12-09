import UserController from '../../controllers/user.controller'
import validateSchema from '../../middlewares/schema'
import { signSchema, SignType, userCreateSchema, UserCreateType } from '../../schemas/user.schemas'
import { FastifyInstanceTyped } from '../../types/types'

export default async function authRoutes(app: FastifyInstanceTyped) {
  const controller = new UserController(app.db)

  app.post<{ Body: UserCreateType }>(
    '/signup',
    {
      preHandler: validateSchema(userCreateSchema),
      schema: {
        body: userCreateSchema,
      },
    },
    (req, res) => {
      return controller.signup(req, res)
    },
  )

  app.post<{ Body: SignType }>(
    '/sign',
    {
      preHandler: validateSchema(signSchema),
      schema: {
        body: signSchema,
      },
    },
    (req, res) => {
      return controller.login(req, res)
    },
  )
}
