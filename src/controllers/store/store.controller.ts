import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../../../generated/client'
import StoreServices from '../../services/store/store.services'
import { StatusCodes } from 'http-status-codes'
import { PaginationArgs } from '../../utils/pagination'
import {
  FindStoreByIdStore,
  FindStoreByOwner,
  StoreType,
  UpdateStoreType,
} from '../../schemas/store.schema'
import UserError from '../../errors/UserError'

export default class StoreController {
  private service: StoreServices

  constructor(db: PrismaClient) {
    this.service = new StoreServices(db)
  }

  public async findAllByOwner(
    req: FastifyRequest<{ Querystring: PaginationArgs }>,
    reply: FastifyReply,
  ) {
    if (!req.signUser) return reply.status(StatusCodes.UNAUTHORIZED).send({})
      
    const data = await this.service.findAllByOwner({ id_owner: req.signUser.id_user }, req.query)
    return reply.send({ stores: data })
  }

  public async find(req: FastifyRequest<{ Params: FindStoreByIdStore }>, reply: FastifyReply) {
    const store = await this.service.find(req.params)
    return reply.send({ store })
  }

  public async update(
    req: FastifyRequest<{ Body: UpdateStoreType; Params: FindStoreByIdStore }>,
    reply: FastifyReply,
  ) {
    const store = await this.service.update(req.params, req.body)
    return reply.send(store)
  }

  public async createNewStore(req: FastifyRequest<{ Body: StoreType }>, reply: FastifyReply) {
    const owner = req.signUser?.id_user
    if (!owner) throw new UserError('Usuario não logado')

    const store = await this.service.createNewStore({ id_owner: owner }, req.body)
    return reply.send(store)
  }

  public async delete(req: FastifyRequest<{ Params: FindStoreByIdStore }>, reply: FastifyReply) {
    const store = await this.service.delete(req.params)
    return reply.send(store)
  }
}
