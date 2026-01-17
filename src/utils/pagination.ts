import z from 'zod'

export default class Pagination {
  private calcTotalPages: number

  constructor(private limit: number, private total: number, private page: number) {
    this.calcTotalPages = calcTotalPages(total, limit)
  }

  public generateMeta(): Meta {
    return {
      page: this.page,
      perPage: this.limit,
      totalPages: this.calcTotalPages,
      total: this.total,
    }
  }
}

export function initPagination({ page, limit }: PaginationArgs) {
  const skip = (page - 1) * limit
  const take = limit

  return { skip, take }
}

export type PaginationArgs = { page: number; limit: number }

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export type Meta = {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export function calcTotalPages(total: number, limit: number) {
  return Math.ceil(total / limit)
}
