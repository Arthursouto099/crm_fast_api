import StoreController from '../../controllers/store/store.controller'
import authMiddleware from '../../middlewares/auth'
import {
  findStoreByIdStore,
  FindStoreByIdStore,
  StoreType,
  storeZodSchema,
  updateStoreSchema,
  UpdateStoreType,
} from '../../schemas/store.schema'
import { FastifyInstanceTyped } from '../../types/types'
import { PaginationArgs, paginationSchema } from '../../utils/pagination'

export default function StoreRoutes(app: FastifyInstanceTyped) {
  const controller = new StoreController(app.db)

  app.get<{ Querystring: PaginationArgs }>(
    '/owner/all',
    {
      preHandler: [authMiddleware],
      schema: {
        params: paginationSchema,
      },
    },
    (req, reply) => {
      return controller.findAllByOwner(
        {
          ...req,
          query: paginationSchema.parse(req.query),
        },
        reply,
      )
    },
  )

  app.get<{ Params: FindStoreByIdStore }>(
    '/owner/:id_store',
    {
      preHandler: [authMiddleware],
      schema: {
        params: findStoreByIdStore,
      },
    },
    (req, reply) => {
      return controller.find(req, reply)
    },
  )

  app.put<{ Params: FindStoreByIdStore; Body: UpdateStoreType }>(
    '/owner/:id_store',
    {
      preHandler: [authMiddleware],
      schema: {
        body: updateStoreSchema,
        params: findStoreByIdStore,
      },
    },
    (req, reply) => {
      return controller.update(req, reply)
    },
  )

  app.post<{ Body: StoreType }>(
    '/owner',
    {
      preHandler: [authMiddleware],
      schema: {
        body: storeZodSchema,
      },
    },
    (req, reply) => {
      return controller.createNewStore(req, reply)
    },
  )

  app.delete<{ Params: FindStoreByIdStore }>(
    '/owner',
    {
      preHandler: [authMiddleware],
      schema: {
        params: findStoreByIdStore,
      },
    },
    (req, reply) => {
      return controller.delete(req, reply)
    },
  )
}
