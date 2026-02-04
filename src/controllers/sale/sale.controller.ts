import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "../../../generated/client";
import SaleServices from "../../services/sale/sale.services";
import { SaleCreateInput } from "../../../generated/models";
import { StatusCodes } from "http-status-codes";


export default class SaleController {
  private service

  public constructor(db: PrismaClient) {
    this.service = new SaleServices(db)
  }

  public async create(
    req: FastifyRequest<{
      Body: Omit<SaleCreateInput, 'store' | 'items' | 'customer' | 'totalAmount' | 'finalAmount'> & {products: {id_product: string, quantity: number}[]},
      Params: {id_customer: string, id_store: string}
    }>,
    reply: FastifyReply,
  ) {
    const {products, ...rest} = req.body
    const data = await this.service.createSale(rest, products, req.params)
    return reply.status(StatusCodes.CREATED).send({sale: data})
  }
}