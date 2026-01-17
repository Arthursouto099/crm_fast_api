import { da } from 'zod/v4/locales'
import { PrismaClient } from '../../../generated/client'
import {
  CreateProductBase,
  EditProductBase,
  FindProductById,
  FindProductsByStore,
  MovementProductType,
  ProductStockDelta,
} from '../../schemas/product.schema'
import { initPagination, PaginationArgs } from '../../utils/pagination'
import MovementStockServices from '../movementStock/movementStock.services'
import { UserIdParamType } from '../../schemas/user.schemas'
import { DefaultArgs } from '@prisma/client/runtime/client'

export default class ProductServices {
  public constructor(private db: PrismaClient) {}

  public async find({ id_product }: FindProductById) {
    return await this.db.product.findUnique({ where: { id_product }, include: { store: true } })
  }

  public async findAllByStore({ id_store }: FindProductsByStore, pag: PaginationArgs) {
    const { skip, take } = initPagination(pag)

    const [data, total] = await Promise.all([
      this.db.product.findMany({
        where: { id_store },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          store: true,
        },
      }),
      this.db.product.count({where: {id_store}}),
    ])

    return {
      data,
      total,
    }
  }

  public async createProduct(
    data: CreateProductBase,
    { id_store }: FindProductsByStore,
    { id_user }: UserIdParamType,
  ) {
    const result = await this.db.$transaction(async (ctx) => {
      const product = await ctx.product.create({
        data: {
          ...data,
          id_store,
        },
      })

      await ctx.movementStock.create({
        data: {
          quantity: product.stock_quantity,
          id_store,
          id_product: product.id_product,
          id_user,
        },
      })

      return product
    })

    return result
  }

  public async update(
    data: EditProductBase,
    { id_product, id_store }: MovementProductType,
    { id_user }: UserIdParamType,
  ) {
    const [product] = await this.db.$transaction(async (ctx) => {
      const product = await ctx.product.update({
        where: {
          id_product,
          id_store,
        },
        data,
      })

      const movement = await ctx.movementStock.create({
        data: {
          id_user,
          id_store,
          id_product,
          quantity: data.stock_quantity ?? 0,
          typeMovement: 'AJUSTE',
        },
      })

      return [product, movement]
    })

    return product
  }

  private getTypeMovement(delta: number) {
    if (delta > 0) return 'ENTRADA'
    if (delta < 0) return 'SAIDA'
    if (delta === 0) return 'AJUSTE'
  }

  private async generateMovementStock(
    ctx: Omit<
      PrismaClient<never, undefined, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
    >,
    {
      delta,
      id_product,
      id_store,
      id_user,
    }: { id_product: string; id_user: string; delta: number; id_store: string },
  ) {
    return await ctx.movementStock.create({
      data: {
        quantity: delta,
        id_product,
        id_store,
        id_user,
        typeMovement: this.getTypeMovement(delta),
      },
    })
  }

  private async transactionMovement(
    { id_product }: FindProductById,
    { delta }: ProductStockDelta,
    { id_store }: FindProductsByStore,
    { id_user }: UserIdParamType,
  ) {
    return await this.db.$transaction(async (ctx) => {
      const where: any = { id_product, id_store }

      if (delta < 0) {
        // considere produtos com estoque maior ou igual a (valor absoluto do delta)
        where.stock_quantity = { gte: Math.abs(delta) }
      }

      const updated = await ctx.product.updateMany({
        where,
        data: { stock_quantity: { increment: delta } },
      })

      if (updated.count === 0) {
        const exists = await ctx.product.findFirst({
          where: { id_product, id_store },
          select: { id_product: true },
        })

        if (!exists) throw new Error('Produto não encontrado')
        throw new Error('Estoque insuficiente')
      }

      await this.generateMovementStock(ctx, { delta, id_product, id_store, id_user })

      return ctx.product.findFirst({ where: { id_product, id_store } })
    })
  }

  public async movementProductStock(
    { delta }: ProductStockDelta,
    { id_product, id_store }: MovementProductType,
    { id_user }: UserIdParamType,
  ) {
    return await this.transactionMovement({ id_product }, { delta }, { id_store }, { id_user })
  }

  public async delete({ id_product }: FindProductById) {
    return await this.db.product.delete({ where: { id_product } })
  }
}
