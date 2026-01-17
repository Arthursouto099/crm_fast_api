import { PrismaClient } from '../../../generated/client'
import { FindStoreByIdStore, FindStoreByOwner, StoreType, UpdateStoreType } from '../../schemas/store.schema'
import { initPagination, PaginationArgs } from '../../utils/pagination'
import { UserSelectKeysRecords } from '../types'
export default class StoreServices {
  constructor(private db: PrismaClient) {}

  public async createNewStore({ id_owner }: FindStoreByOwner, data: StoreType) {
    return await this.db.store.create({
      data: {
        ...data,
        id_owner
      }
    })
  }

  public async findAllByOwner({ id_owner }: FindStoreByOwner, pag: PaginationArgs) {
    const { skip, take } = initPagination(pag)
    return await this.db.store.findMany({
      where: { id_owner },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: UserSelectKeysRecords },
        products: true,
      },
    })
  }

  public async find({ id_store }: FindStoreByIdStore) {
    return await this.db.store.findFirst({
      where: { id_store },
      include: { owner: { select: UserSelectKeysRecords }, products: true },
    })
  }

  public async update({ id_store }: FindStoreByIdStore, data: UpdateStoreType) {
    return await this.db.store.update({ where: { id_store }, data })
  }

  public async delete({ id_store }: FindStoreByIdStore) {
    return await this.db.store.delete({ where: { id_store } })
  }


}
