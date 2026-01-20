import { CustomerUpdateInput } from '../../../generated/models'
import CustomerController from '../../controllers/customer/customer.controller'
import authMiddleware from '../../middlewares/auth'
import {
  CreateCustomerBase,
  createCustomerSchema,
  findCustomerById,
  FindCustomerById,
  UpdateCustomerAddress,
  updateCustomerAddressSchema,
  updateCustomerSchema,
} from '../../schemas/customer.schema'
import { FindStoreByIdStore, findStoreByIdStore } from '../../schemas/store.schema'
import { FastifyInstanceTyped } from '../../types/types'
import { PaginationArgs, paginationSchema } from '../../utils/pagination'
import z from 'zod'

export default function CustomerRoutes(app: FastifyInstanceTyped) {
  const controller = new CustomerController(app.db)

  ;(app.post<{ Body: CreateCustomerBase; Params: FindStoreByIdStore }>(
    '/:id_store/create',
    {
      schema: {
        body: createCustomerSchema,
        params: findStoreByIdStore,
      },
    },
    (req, reply) => {
      return controller.createCustomer(req, reply)
    },
  ),
    app.get<{ QueryString: PaginationArgs; Params: FindStoreByIdStore }>(
      '/:id_store/all',
      {
        schema: {
          querystring: paginationSchema,
          params: findStoreByIdStore,
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
    ),
    app.patch<{ Body: CustomerUpdateInput; Params: FindCustomerById }>(
      '/:id_customer/edit',
      {
        schema: {
          body: updateCustomerSchema.omit({ id_store: true }),
          params: findCustomerById,
        },
      },
      (req, reply) => {
        return controller.updateCustomer(req, reply)
      },
    ))

  app.delete<{ Params: FindCustomerById }>(
    '/:id_customer/delete',
    {
      schema: {
        params: findCustomerById,
      },
    },
    (req, reply) => {
      return controller.deleteCustomer(req, reply)
    },
  )

  app.patch<{
    Body: Omit<UpdateCustomerAddress, 'id_customer' | 'id_customerAddress'>
    Params: { id_customerAddress: string }
  }>(
    '/:id_customerAddress/address/edit',
    {
      schema: {
        body: updateCustomerAddressSchema.omit({ id_customer: true, id_customerAddress: true }),
        params: z.object({ id_customerAddress: z.uuid() }),
      },
    },
    (req, reply) => {
      return controller.updateAddress(req, reply)
    },
  )

  app.delete<{ Params: { id_customerAddress: string } }>(
    '/:id_customerAddress/address/delete',
    {
      schema: {
        params: z.object({ id_customerAddress: z.uuid() }),
      },
    },
    (req, reply) => {
      return controller.deleteAddress(req, reply)
    },
  )
}
