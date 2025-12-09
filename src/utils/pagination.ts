import z from 'zod'

export function initPagination({ page, limit }: PaginationArgs) {
  const skip = (page - 1) * limit
  const take = limit

  return { skip, take }
}

export type PaginationArgs = { page: number; limit: number }
export const paginationSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})
