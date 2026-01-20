import { da } from 'zod/v4/locales'
import { Customer, PrismaClient, Store } from '../../../generated/client'
import {
  CustomerUpdateArgs,
  CustomerUpdateInput,
  CustomerWhereInput,
  CustomerWhereUniqueInput,
  UserCreateInput,
  UserWhereUniqueInput,
} from '../../../generated/models'
import {
  CreateCustomerBase,
  EditCustomerBase,
  FindCustomerById,
} from '../../schemas/customer.schema'
import { FindStoreByIdStore } from '../../schemas/store.schema'
import AddressServices from '../address/address.services'
import { DefaultArgs } from '@prisma/client/runtime/client'
import Pagination, { initPagination, PaginationArgs } from '../../utils/pagination'

export default class CustomerServices {
  private addressServices: AddressServices

  public constructor(private db: PrismaClient) {
    this.addressServices = new AddressServices(this.db)
  }

  public async createCustomerWithCTX(
    ctx: Omit<
      PrismaClient<never, undefined, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
    >,
    data: Omit<CreateCustomerBase, 'address'>,
  ) {
    const { id_store, ...rest } = data

    if (!id_store) throw new Error('id_store não fornecido')

    return await ctx.customer.create({
      data: {
        ...rest,
        id_store,
      },
    })
  }

  public async findCustomerWithCTX(
    ctx: Omit<
      PrismaClient<never, undefined, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
    >,
    where: CustomerWhereInput,
  ) {
    if (where) {
      return await ctx.customer.findFirst({
        where,
        include: { addresses: true, mainAddress: true },
      })
    }
  }

  public async updateCustomerWithCTX(
    ctx: Omit<
      PrismaClient<never, undefined, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
    >,
    inputs: Pick<CustomerUpdateArgs, 'data'>,
    where: CustomerWhereUniqueInput,
  ) {
    return await ctx.customer.update({
      data: inputs.data,
      where,
      include: { addresses: true, mainAddress: true },
    })
  }

  public async createCustomer(data: CreateCustomerBase, { id_store }: FindStoreByIdStore) {
    const customer = await this.db.$transaction(async (ctx) => {
      const { address, ...customerData } = data
      const finalCustomerParam = { ...customerData, id_store: id_store }

      const customer = await this.createCustomerWithCTX(ctx, finalCustomerParam)

      if (!address) {
        return await this.findCustomerWithCTX(ctx, { id_customer: customer.id_customer })
      }

      const finalAddressParam = { ...address, id_customer: customer.id_customer }
      const mainAddress = await this.addressServices.createCustomerAddressWithCTX(
        ctx,
        finalAddressParam,
      )

      return await this.updateCustomerWithCTX(
        ctx,
        { data: { id_address: mainAddress.id_customerAddress } },
        { id_customer: customer.id_customer },
      )
    })

    return customer
  }

  public async findAll(pag: PaginationArgs, { id_store }: FindStoreByIdStore) {
    const { skip, take } = initPagination(pag)

    return await Promise.all([
      await this.db.customer.findMany({
        skip,
        take,
        include: { addresses: true, mainAddress: true },
        orderBy: { createdAt: 'desc' },
        where: { id_store },
      }),
      await this.db.customer.count({ where: { id_store } }),
    ])
  }

  public async updateCustomer(data: CustomerUpdateInput, where: CustomerWhereUniqueInput) {
    return await this.db.customer.update({
      data,
      where,
      include: { mainAddress: true },
    })
  }

  public async deleteCustomer(where: CustomerWhereUniqueInput) {
    return await this.db.customer.delete({ where })
  }
}
