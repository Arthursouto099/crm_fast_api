import MovementStockController from '../../controllers/movementStock/movementStoct.controller'
import authMiddleware from '../../middlewares/auth'
import { findStoreByIdStore, FindStoreByIdStore } from '../../schemas/store.schema'
import { FastifyInstanceTyped } from '../../types/types'
import { PaginationArgs, paginationSchema } from '../../utils/pagination'

export default async function MovementStockRoutes(app: FastifyInstanceTyped) {
  const controller = new MovementStockController(app.db)

  app.get<{ Params: FindStoreByIdStore; QueryString: PaginationArgs }>(
    '/movements/all/store/:id_store',
    {
      schema: {
        params: findStoreByIdStore,
        querystring: paginationSchema,
      },
      preHandler: [authMiddleware],
    },
    (req, reply) => {
        return controller.findAllByStore(
            {
                ...req,
                query: paginationSchema.parse(req.query)
            },
            reply
        )
    }
  )


  app.get<{Params: FindStoreByIdStore}>(
    "/metrics/entries/:id_store",
    {schema: {
      params: findStoreByIdStore
    },
    preHandler: [authMiddleware] 
    },
    (req, reply) => {
      return controller.findEntriesToday(req, reply)
    }
  )

  
  app.get<{Params: FindStoreByIdStore}>(
    "/metrics/departures/:id_store",
    {schema: {
      params: findStoreByIdStore
    },
    preHandler: [authMiddleware] 
    },
    (req, reply) => {
      return controller.findDeparturesToday(req, reply)
    }
  )


   app.get<{ Params: FindStoreByIdStore }>(
     '/metrics/30/days/:id_store',
     {
       schema: {
         params: findStoreByIdStore,
       },
       preHandler: [authMiddleware],
     },
     (req, reply) => {
       return controller.findMetricsByLast30Days(req, reply)
     },
   )

  
}
