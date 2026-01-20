import { DefaultArgs } from '@prisma/client/runtime/client'
import { CustomerAddress, PrismaClient } from '../../../generated/client'
import { CreateCustomerAddress, UpdateCustomerAddress } from '../../schemas/customer.schema'
import {
  CustomerAddressUpdateInput,
  CustomerAddressWhereInput,
  CustomerAddressWhereUniqueInput,
} from '../../../generated/models'

export default class AddressServices {
  public constructor(private db: PrismaClient) {}

  public async createCustomerAddress(data: CreateCustomerAddress) {
    return await this.db.customerAddress.create({ data })
  }

  public async createCustomerAddressWithCTX(
    ctx: Omit<
      PrismaClient<never, undefined, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
    >,
    data: CreateCustomerAddress,
  ) {
    return await ctx.customerAddress.create({ data })
  }

  public async updateAddress(
    data: Omit<UpdateCustomerAddress, 'id_customer' | 'id_customerAddress'>,
    where: CustomerAddressWhereUniqueInput,
  ) {
    return await this.db.customerAddress.update({
      where,
      data,
      include: { customer: true, mainOfCustomer: true },
    })
  }

  public async deleteAddress(where: CustomerAddressWhereUniqueInput) {
    return await this.db.customerAddress.delete({
      where,
    })
  }
}
