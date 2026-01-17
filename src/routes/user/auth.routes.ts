import UserController from '../../controllers/user.controller'
import validateSchema from '../../middlewares/schema'
import { signSchema, SignType, userCreateSchema, UserCreateType, userWithStoreSchema, UserWithStoreType} from '../../schemas/user.schemas'
import { FastifyInstanceTyped } from '../../types/types'

export default async function authRoutes(app: FastifyInstanceTyped) {
  const controller = new UserController(app.db)

  app.post<{ Body: UserWithStoreType }>(
    '/signup',
    {
      schema: {
        body: userWithStoreSchema,
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
