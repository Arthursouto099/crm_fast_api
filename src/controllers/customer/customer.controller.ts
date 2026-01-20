import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../../../generated/client'
import CustomerServices from '../../services/customer/customer.services'
import {
  CreateCustomerBase,
  FindCustomerById,
  UpdateCustomerAddress,
} from '../../schemas/customer.schema'
import { FindStoreByIdStore } from '../../schemas/store.schema'
import { StatusCodes } from 'http-status-codes'
import Pagination, { PaginationArgs } from '../../utils/pagination'
import { CustomerUpdateInput } from '../../../generated/models'
import AddressServices from '../../services/address/address.services'

export default class CustomerController {
  private service: CustomerServices
  private subService: AddressServices

  public constructor(db: PrismaClient) {
    this.service = new CustomerServices(db)
    this.subService = new AddressServices(db)
  }

  public async createCustomer(
    req: FastifyRequest<{ Body: CreateCustomerBase; Params: FindStoreByIdStore }>,
    reply: FastifyReply,
  ) {
    const data = await this.service.createCustomer(req.body, req.params)
    return reply.status(StatusCodes.CREATED).send({ customer: data })
  }

  public async findAll(
    req: FastifyRequest<{ Params: FindStoreByIdStore; Querystring: PaginationArgs }>,
    reply: FastifyReply,
  ) {
    const { id_store } = req.params
    const { limit, page } = req.query

    const [customers, total] = await this.service.findAll(req.query, { id_store })

    const meta = new Pagination(limit, total, page).generateMeta()

    return reply.send({ customers: { list: customers }, meta })
  }

  public async updateCustomer(
    req: FastifyRequest<{ Params: FindCustomerById; Body: CustomerUpdateInput }>,
    reply: FastifyReply,
  ) {
    const data = await this.service.updateCustomer(req.body, req.params)
    return reply.status(StatusCodes.OK).send({ customer: data })
  }

  public async deleteCustomer(req: FastifyRequest<{ Params: FindCustomerById }>, reply: FastifyReply) {
    await this.service.deleteCustomer(req.params)
    return reply.status(StatusCodes.NO_CONTENT).send()
  }

  public async updateAddress(
    req: FastifyRequest<{
      Params: { id_customerAddress: string }
      Body: Omit<UpdateCustomerAddress, 'id_customer' | 'id_customerAddress'>
    }>,
    reply: FastifyReply,
  ) {
    const data = await this.subService.updateAddress(req.body, req.params)
    return reply.status(StatusCodes.OK).send({ customer: data })
  }

  public async deleteAddress(
    req: FastifyRequest<{
      Params: {id_customerAddress: string}
    }>,
    reply: FastifyReply
  ) {
    await this.subService.deleteAddress(req.params)
    return reply.status(StatusCodes.NO_CONTENT).send()
  }
}
