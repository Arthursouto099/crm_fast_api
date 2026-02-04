import { PrismaClient, Product, SaleItem } from '../../../generated/client'
import { SaleCreateInput, SaleItemCreateInput } from '../../../generated/models'
import { Decimal } from '@prisma/client/runtime/client'

export default class SaleServices {
  public constructor(private db: PrismaClient) {}

  private normalizeList(
    input: Product[],
    subInputs: { id_product: string; quantity: number }[],
  ): Omit<SaleItem, 'id_sale' | 'id_sale_item' | 'createdAt'>[] {
    return input.map((product) => {
      const p = subInputs.find((pd) => pd.id_product === product.id_product)

      if (!p) {
        throw new Error(`Produto ${product.id_product} não informado na venda`)
      }

      if (product.stock_quantity < p.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.id_product}`)
      }

      return {
        id_product: product.id_product,
        quantity: p.quantity,
        unitPrice: product.product_price,
        totalPrice: product.product_price.mul(p.quantity),
      }
    })
  }

  private resolveTotal(saleItems: Omit<SaleItem, 'id_sale' | 'id_sale_item' | 'createdAt'>[]) {
    return saleItems.reduce((acc, current) => {
      return acc.add(current.totalPrice)
    }, new Decimal(0))
  }

  public async createSale(
    data: Omit<SaleCreateInput, 'store' | 'items' | 'customer' | 'totalAmount' | 'finalAmount'>,
    saleItem: { id_product: string; quantity: number }[],
    { id_customer, id_store }: { id_customer: string; id_store: string },
  ) {
    const user = await this.db.customer.findUnique({
      where: { id_customer },
      select: { active: true },
    })

    if (!user) throw new Error('Cliente não encontrado')
    if (!user.active) throw new Error('Cliente desativado')

    const products = await this.db.product.findMany({
      where: { id_product: { in: saleItem.map((p) => p.id_product) }, id_store },
    })

    if (products.length !== saleItem.length) throw new Error('Algum produto não foi encontrado')

    const saleItems = this.normalizeList(products, saleItem)
    const totalSaleItems = this.resolveTotal(saleItems)
    const discount = data.discount ?? new Decimal(0)

    return await this.db.$transaction(async (ctx) => {
      const sale = await ctx.sale.create({
        data: {
          ...data,
          id_customer,
          id_store,
          totalAmount: totalSaleItems,
          discount,
          finalAmount: totalSaleItems.minus(discount as Decimal),
        },
      })

      await ctx.saleItem.createMany({
        data: saleItems.map((p) => ({
          ...p,
          id_sale: sale.id_sale,
        })),
      })

      await Promise.all(
        saleItems.map((p) =>
          ctx.product.update({
            where: { id_product: p.id_product },
            data: { stock_quantity: { decrement: p.quantity } },
          }),
        ),
      )

      return await ctx.sale.findUnique({
        where: { id_sale: sale.id_sale },
        include: { customer: true, items: { include: { product: true } } },
      })
    })
  }
}
