import { PrismaClient } from '../../generated/client'
import { FastifyInstanceTyped } from '../types/types'
import { z } from 'zod'
import userRoutes from './user/user.routes'
import authRoutes from './user/auth.routes'
import ProjectRoutes from './project/project.routes'

const admSchema = z.object({
  name: z.string(),
  password: z.string(),
})

export default async function routes(app: FastifyInstanceTyped) {
  app.register(userRoutes, { prefix: '/user' })
  app.register(authRoutes, { prefix: '/auth' })
  app.register(ProjectRoutes, {prefix: '/project'})
}
