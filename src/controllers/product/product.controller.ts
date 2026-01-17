import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../../../generated/client'
import ProductServices from '../../services/product/product.services'
import {
  CreateProductBase,
  EditProductBase,
  FindProductById,
  FindProductsByStore,
  MovementProductType,
  ProductStockDelta,
} from '../../schemas/product.schema'
import Pagination, { PaginationArgs } from '../../utils/pagination'

export default class ProductController {
  private service: ProductServices

  constructor(db: PrismaClient) {
    this.service = new ProductServices(db)
  }

  public async findAllByStore(
    req: FastifyRequest<{ Params: FindProductsByStore; Querystring: PaginationArgs }>,
    reply: FastifyReply,
  ) {
    const { limit, page } = req.query
    const { data, total } = await this.service.findAllByStore(req.params, req.query)

    const meta = new Pagination(limit, total, page).generateMeta()
    return reply.send({ products: { data, meta } })
  }

  public async create(
    req: FastifyRequest<{ Body: CreateProductBase; Params: FindProductsByStore }>,
    reply: FastifyReply,
  ) {
    const product = await this.service.createProduct(req.body, req.params, {
      id_user: req.signUser?.id_user!,
    })
    return reply.send({ product })
  }

  public async update(
    req: FastifyRequest<{ Body: EditProductBase; Params: MovementProductType }>,
    reply: FastifyReply,
  ) {
    const product = await this.service.update(req.body, req.params, {
      id_user: req.signUser?.id_user!,
    })
    return reply.send({ product })
  }

  public async find(req: FastifyRequest<{ Params: FindProductById }>, reply: FastifyReply) {
    const product = await this.service.find(req.params)
    return reply.send({ product })
  }

  public async movementProductStock(
    req: FastifyRequest<{ Body: ProductStockDelta; Params: MovementProductType }>,
    reply: FastifyReply,
  ) {
    const product = await this.service.movementProductStock(req.body, req.params, {
      id_user: req.signUser?.id_user!,
    })
    return reply.send({ product })
  }

  public async delete(req: FastifyRequest<{ Params: FindProductById }>, reply: FastifyReply) {
    const product = await this.service.delete(req.params)
    return reply.send({ product })
  }
}
