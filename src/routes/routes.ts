import { PrismaClient } from '../../generated/client'
import { FastifyInstanceTyped } from '../types/types'
import { z } from 'zod'
import userRoutes from './user/user.routes'
import authRoutes from './user/auth.routes'
import StoreRoutes from './store/store.routes'
import ProjectRoutes from './product/product.routes'
import MovementStockRoutes from './movementStock/movementStock.routes'
import CustomerRoutes from './customer/customer.routes'

const admSchema = z.object({
  name: z.string(),
  password: z.string(),
})

export default async function routes(app: FastifyInstanceTyped) {
  app.register(userRoutes, { prefix: '/user' })
  app.register(authRoutes, { prefix: '/auth' })
  app.register(StoreRoutes, { prefix: '/store' })
  app.register(ProjectRoutes, { prefix: '/products' })
  app.register(MovementStockRoutes, { prefix: '/movement' })
  app.register(CustomerRoutes, { prefix: '/customer' })
}
