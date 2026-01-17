import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../../../generated/client'
import { FindStoreByIdStore } from '../../schemas/store.schema'
import MovementStockServices from '../../services/movementStock/movementStock.services'
import Pagination, { PaginationArgs } from '../../utils/pagination'

export default class MovementStockController {
  private service: MovementStockServices

  constructor(db: PrismaClient) {
    this.service = new MovementStockServices(db)
  }

  public async findAllByStore(
    req: FastifyRequest<{ Params: FindStoreByIdStore; Querystring: PaginationArgs }>,
    reply: FastifyReply,
  ) {
    const { limit, page } = req.query
    const { data, total } = await this.service.findAllByStore(req.query, req.params)

    const meta = new Pagination(limit, total, page).generateMeta()
    return reply.send({ movements: { data, meta } })
  }

  public async findEntriesToday(
    req: FastifyRequest<{ Params: FindStoreByIdStore }>,
    reply: FastifyReply,
  ) {
    const data = await this.service.findEntriesToday(req.params)
    return reply.send({ movements: data })
  }

  public async findDeparturesToday(
    req: FastifyRequest<{ Params: FindStoreByIdStore }>,
    reply: FastifyReply,
  ) {
    const data = await this.service.findDeparturesoday(req.params)
    return reply.send({ movements: data })
  }

  public async findMetricsByLast30Days(
    req: FastifyRequest<{ Params: FindStoreByIdStore }>,
    reply: FastifyReply,
  ) {
    const data = await this.service.findMetricsByLast30Days(req.params)
    return reply.send({ metrics: data })
  }
}
