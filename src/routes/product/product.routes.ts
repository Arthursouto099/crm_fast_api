import ProductController from '../../controllers/product/product.controller'
import authMiddleware from '../../middlewares/auth'
import {
  CreateProductBase,
  createProductSchema,
  EditProductBase,
  findProductById,
  FindProductById,
  findProductsByStore,
  FindProductsByStore,
  movementProduct,
  MovementProductType,
  ProductStockDelta,
  productStockDeltaSchema,
  updateProductSchema,
} from '../../schemas/product.schema'
import { FastifyInstanceTyped } from '../../types/types'
import { PaginationArgs, paginationSchema } from '../../utils/pagination'

export default async function ProductRoutes(app: FastifyInstanceTyped) {
  const controller = new ProductController(app.db)

  app.get<{ Params: FindProductsByStore; Querystring: PaginationArgs }>(
    '/all/:id_store',
    {
      schema: {
        params: findProductsByStore,
        querystring: paginationSchema,
      },
    },
    (req, reply) => {
      return controller.findAllByStore(
        {
          ...req,
          query: paginationSchema.parse(req.query),
        },
        reply,
      )
    },
  )

  app.get<{ Params: FindProductById }>(
    '/product/:id_product',
    {
      schema: {
        params: findProductById,
      },
    },
    (req, reply) => {
      return controller.find(req, reply)
    },
  )

  app.post<{ Body: CreateProductBase; Params: FindProductsByStore }>(
    '/create/:id_store',
    {
      schema: {
        body: createProductSchema,
      },
    },
    (req, reply) => {
      return controller.create(req, reply)
    },
  )

  app.put<{ Body: EditProductBase; Params: MovementProductType }>(
    '/edit/product/:id_product/store/:id_store',
    {
      schema: {
        body: updateProductSchema,
        params: movementProduct,
      },
    },
    (req, reply) => {
      return controller.update(req, reply)
    },
  )

  app.patch<{ Body: ProductStockDelta; Params: MovementProductType }>(
    '/movement/product/:id_product/store/:id_store',
    {
      schema: {
        body: productStockDeltaSchema,
        params: movementProduct,
      },
    },
    (req, reply) => {
      return controller.movementProductStock(req, reply)
    },
  )

  app.delete<{ Params: FindProductById }>(
    '/product/:id_product',
    {
      schema: {
        params: findProductById,
      },
    },
    (req, reply) => {
      return controller.delete(req, reply)
    },
  )
}
