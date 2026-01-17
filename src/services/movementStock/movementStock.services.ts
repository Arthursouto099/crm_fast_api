import { PrismaClient } from '../../../generated/client'
import { MovementStockCreateInput } from '../../../generated/models'
import { FindStoreByIdStore } from '../../schemas/store.schema'
import { initPagination, PaginationArgs } from '../../utils/pagination'
import { UserSelectKeysRecords } from '../types'

export default class MovementStockServices {
  public constructor(private db: PrismaClient) {}

  public async findAllByStore(pag: PaginationArgs, store: FindStoreByIdStore) {
    const { skip, take } = initPagination(pag)

    const [data, total] = await Promise.all([
      await this.db.movementStock.findMany({
        where: store,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id_user: true, name: true, email: true } },
          product: true,
          store: { select: { store_name: true, id_store: true } },
        },
      }),
      await this.db.movementStock.count({ where: { store } }),
    ])

    return {
      data,
      total,
    }
  }

  public async findEntriesToday({ id_store }: FindStoreByIdStore): Promise<number> {
    const result = await this.db.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*):: INT as count
    FROM public."MovementStock"
    WHERE "typeMovement" = 'ENTRADA'
      AND "createdAt"::date = CURRENT_DATE
      AND "id_store" = ${id_store};
  `
    return result[0]?.count ?? 0
  }

  public async findDeparturesoday({ id_store }: FindStoreByIdStore) {
    const result = await this.db.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count 
      FROM public."MovementStock"
      WHERE "typeMovement"='SAIDA'
      AND "createdAt"::date=CURRENT_DATE
      AND "id_store" = ${id_store} `
    return result[0]?.count ?? 0
  }

  public async findMetricsByLast30Days({ id_store }: FindStoreByIdStore) {
    const result = await this.db.$queryRaw<{ day: Date; entries: number; departures: number }[]>`
     SELECT date_trunc('day', ms."createdAt") AS day,
     COUNT(*) FILTER (WHERE ms."typeMovement" = 'ENTRADA')::INT AS entries,
     COUNT(*) FILTER (WHERE ms."typeMovement" = 'SAIDA')::INT as departures
     FROM public."MovementStock" as ms 
     WHERE ms.id_store = ${id_store} 
     AND ms."createdAt" >= NOW() - INTERVAL '30 days'
     GROUP BY day
     ORDER BY day
    `
    return result
  }
}
